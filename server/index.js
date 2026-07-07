import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import cors from "cors";
import rateLimit from "express-rate-limit";
import nodemailer from "nodemailer";
import { z } from "zod";
import { randomUUID } from "crypto";
import http from "http";
import { WebSocketServer } from "ws";
import { db } from "./db.js";

import bannedWords from "./bad-words.json" with { type: "json" };

dotenv.config();

const app = express();
const allowedOrigins = [
  "http://localhost:3030",
  "http://localhost:5173",
  "https://bbastian.dev",
  "https://noury.bbastian.dev",
];

/* Spotify credentials (needed before CORS for auth routes) */
const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const SPOTIFY_REFRESH_TOKEN = process.env.SPOTIFY_REFRESH_TOKEN;

const basic = Buffer.from(
  `${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`,
).toString("base64");
const NOW_PLAYING_ENDPOINT =
  "https://api.spotify.com/v1/me/player/currently-playing";
const RECENTLY_PLAYED_ENDPOINT =
  "https://api.spotify.com/v1/me/player/recently-played?limit=1";
const TOP_TRACKS_ENDPOINT = "https://api.spotify.com/v1/me/top/tracks";
const TOKEN_ENDPOINT = "https://accounts.spotify.com/api/token";

/* Spotify OAuth – no CORS needed (direct browser navigation) */
const SPOTIFY_REDIRECT_URI = "https://bbastian.dev/spotify-callback";
const SPOTIFY_SCOPES = [
  "user-read-currently-playing",
  "user-read-recently-played",
  "user-top-read",
].join(" ");

app.get("/spotify/auth", (req, res) => {
  const url =
    "https://accounts.spotify.com/authorize?" +
    new URLSearchParams({
      response_type: "code",
      client_id: SPOTIFY_CLIENT_ID,
      scope: SPOTIFY_SCOPES,
      redirect_uri: SPOTIFY_REDIRECT_URI,
    });
  res.redirect(url);
});

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(new Error("No origin"), false);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      if (/^https:\/\/([\w-]+\.)*bbastian\.dev$/.test(origin))
        return callback(null, true);
      callback(new Error("Not allowed by CORS"), false);
    },
    credentials: true,
  }),
);

function parseCookies(req) {
  const header = req.headers.cookie || "";
  return Object.fromEntries(
    header
      .split(";")
      .map((c) => c.trim().split("="))
      .filter(([k]) => k)
      .map(([k, ...v]) => [k.trim(), decodeURIComponent(v.join("="))]),
  );
}
app.use(express.json());

/**
 * GET /github-stats
 * Returns repo count, stars, years active and top languages.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {Promise<void>}
 */
app.get("/github-stats", async (req, res) => {
  try {
    const headers = {
      Authorization: `token ${process.env.GITHUB_TOKEN}`,
    };

    const username = process.env.GITHUB_USERNAME;

    const userRes = await fetch(`https://api.github.com/users/${username}`, {
      headers,
    });
    const user = await userRes.json();

    const reposRes = await fetch(
      `https://api.github.com/users/${username}/repos?per_page=100`,
      { headers },
    );
    const repos = await reposRes.json();

    const stars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);

    const languageTotals = {};

    for (const repo of repos) {
      if (repo.fork) continue;

      const langRes = await fetch(repo.languages_url, { headers });
      const langs = await langRes.json();

      for (const [lang, bytes] of Object.entries(langs)) {
        languageTotals[lang] = (languageTotals[lang] || 0) + bytes;
      }
    }

    const totalBytes = Object.values(languageTotals).reduce((a, b) => a + b, 0);

    const languages = Object.entries(languageTotals)
      .map(([lang, bytes]) => ({
        name: lang,
        percent: Math.round((bytes / totalBytes) * 100),
      }))
      .sort((a, b) => b.percent - a.percent)
      .slice(0, 3);

    const createdAt = new Date(user.created_at);
    const yearsActive = Math.floor(
      (Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24 * 365),
    );

    const lastActive =
      repos
        .filter((r) => !r.fork)
        .sort((a, b) => new Date(b.pushed_at) - new Date(a.pushed_at))[0]
        ?.pushed_at ?? null;

    res.json({
      repos: repos.length,
      stars,
      yearsActive,
      languages,
      lastActive,
    });
  } catch (err) {
    res.status(500).json({ error: "GitHub API failed" });
  }
});

/* Spotify */

async function getAccessToken() {
  const response = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: SPOTIFY_REFRESH_TOKEN,
    }),
  });

  const text = await response.text();

  let data;
  try {
    data = JSON.parse(text);
  } catch {
    console.error("Spotify token raw response:", text);
    throw new Error("Invalid Spotify token response");
  }

  if (!data.access_token) {
    console.error("Spotify token error:", data);
    throw new Error("No Spotify access token");
  }

  return data;
}

async function getNowPlaying() {
  const { access_token } = await getAccessToken();

  const response = await fetch(NOW_PLAYING_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });

  if (response.status === 204 || response.status > 400) {
    return null;
  }

  return response.json();
}

async function getRecentlyPlayed() {
  const { access_token } = await getAccessToken();

  const response = await fetch(RECENTLY_PLAYED_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });

  if (response.status > 400) {
    return null;
  }

  return response.json();
}

app.get("/spotify/exchange", async (req, res) => {
  const code = req.query.code;
  if (!code) return res.status(400).json({ error: "Missing code" });

  const tokenRes = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: SPOTIFY_REDIRECT_URI,
    }),
  });

  const data = await tokenRes.json();

  if (!data.refresh_token) {
    console.error("Spotify exchange error:", data);
    return res.status(500).json({ error: "Failed", detail: data });
  }

  console.log("=== NEW SPOTIFY REFRESH TOKEN ===");
  console.log(data.refresh_token);

  res.json({ refresh_token: data.refresh_token });
});

/**
 * GET /spotify/now-playing
 * Returns the currently playing or last played Spotify track/episode.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {Promise<void>}
 */
app.get("/spotify/now-playing", async (req, res) => {
  try {
    const nowPlaying = await getNowPlaying();

    if (nowPlaying && nowPlaying.is_playing && nowPlaying.item) {
      const item = nowPlaying.item;

      if (item.type === "track") {
        return res.json({
          status: "playing",
          type: "track",
          track: {
            title: item.name,
            artist: item.artists.map((a) => a.name).join(", "),
            album: item.album.name,
            albumArt: item.album.images[0]?.url || "",
            isPlaying: nowPlaying.is_playing,
            progress: nowPlaying.progress_ms,
            duration: item.duration_ms,
            url: item.external_urls.spotify,
          },
        });
      }

      if (item.type === "episode") {
        return res.json({
          status: "playing",
          type: "episode",
          episode: {
            title: item.name,
            show: item.show.name,
            description: item.description,
            image: item.images?.[0]?.url || item.show.images?.[0]?.url || "",
            progress: nowPlaying.progress_ms,
            duration: item.duration_ms,
            url: item.external_urls.spotify,
          },
        });
      }
    }

    const recentlyPlayed = await getRecentlyPlayed();

    if (recentlyPlayed?.items?.length > 0) {
      const track = recentlyPlayed.items[0].track;
      return res.json({
        status: "idle",
        lastPlayed: {
          title: track.name,
          artist: track.artists.map((a) => a.name).join(", "),
          albumArt: track.album.images[0]?.url || "",
        },
      });
    }

    return res.json({ status: "idle" });
  } catch (error) {
    console.error("Spotify API Error:", error);
    return res.json({ status: "error" });
  }
});

/**
 * GET /spotify/top-tracks
 * Returns top 10 Spotify tracks for a given time range.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {Promise<void>}
 */
app.get("/spotify/top-tracks", async (req, res) => {
  const allowed = ["short_term", "medium_term", "long_term"];
  const time_range = allowed.includes(req.query.time_range)
    ? req.query.time_range
    : "short_term";
  const limit = req.query.limit === "50" ? 50 : 10;

  try {
    const { access_token } = await getAccessToken();

    const response = await fetch(
      `${TOP_TRACKS_ENDPOINT}?limit=${limit}&time_range=${time_range}`,
      { headers: { Authorization: `Bearer ${access_token}` } },
    );

    if (response.status > 400) {
      const errBody = await response.text();
      console.error("Spotify Top Tracks status:", response.status, errBody);
      return res
        .status(502)
        .json({ error: "Spotify API error", status: response.status });
    }

    const data = await response.json();

    const tracks = data.items.map((item, index) => ({
      rank: index + 1,
      title: item.name,
      artist: item.artists.map((a) => a.name).join(", "),
      album: item.album.name,
      albumArt: item.album.images[0]?.url || "",
      url: item.external_urls.spotify,
      previewUrl: item.preview_url || null,
      duration: item.duration_ms,
      popularity: item.popularity,
    }));

    return res.json({ tracks, time_range });
  } catch (error) {
    console.error("Spotify Top Tracks Error:", error);
    return res.status(500).json({ error: "Failed to fetch top tracks" });
  }
});

const ARTIST_HALL_OF_FAME_IDS = [
  "1ul8iLt2WnFe2UIyovjg7q",
  "5pVRwX5ZQR7hfJ18w8ZYkl",
  "4gJT0OnBISFA5CPMNYBGIE",
  "1fImPZoBVjmYrBFzCHh0N3",
  "1bpI6QDUqmfKmV0Tlhj0Jm",
  "2IVvZIe3P9BMuCI6h48Bjg",
  "3drqpTL4sQOckmAfF9i1wg",
  "6ioU7VVUMpOhlsD1b9A4xP",
  "1dVKBw8iMPpS1almxwIVI3",
  "3CJKkU0XuElRT1z8rEtIYg",
  "2F0M1eZ2BZFNFPCq3eKCtA",
  "7slJ8mgbVwvyPEzQMJ5qYO",
  "0lE1by0S3JE5W2BrEopkUh",
  "6bM6rpwjhvxuKSQ2OJ2eQC",
];

/**
 * GET /spotify/artist-hall-of-fame
 * Returns a curated list of all-time favourite artists.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {Promise<void>}
 */
app.get("/spotify/artist-hall-of-fame", async (req, res) => {
  try {
    const { access_token } = await getAccessToken();

    const response = await fetch(
      `https://api.spotify.com/v1/artists?ids=${ARTIST_HALL_OF_FAME_IDS.join(",")}`,
      { headers: { Authorization: `Bearer ${access_token}` } },
    );

    if (response.status > 400) {
      const errBody = await response.text();
      console.error("Spotify Artist HoF status:", response.status, errBody);
      return res
        .status(502)
        .json({ error: "Spotify API error", status: response.status });
    }

    const data = await response.json();

    const artists = data.artists.map((item, index) => ({
      index,
      name: item.name,
      image: item.images[0]?.url || "",
      genres: item.genres.slice(0, 3),
      followers: item.followers.total,
      popularity: item.popularity,
      url: item.external_urls.spotify,
    }));

    return res.json({ artists });
  } catch (error) {
    console.error("Spotify Artist HoF Error:", error);
    return res
      .status(500)
      .json({ error: "Failed to fetch artist hall of fame" });
  }
});

const HALL_OF_FAME_IDS = [
  "3ouqRo2zDJjewIao5CFFGN",
  "2R5kWKlRKal6lZOkdQxUSc",
  "27c0YWljuBXtT4tN2GZBQ7",
  "7na1uJMyHz0a73FMUtrQSi",
  "6SPxw3c1N7RNdr5Z3z2tEG",
  "01F24uRyIWAkvdUPFpzanr",
  "5yVhcpTvQYr4LooQ0dt4l4",
  "0uZl6rkTxmKLK4aFVMOHfh",
  "0qwt5HYzZkGM6YhjE9rhW6",
  "32wSOXobJuH34ebt8OaXAV",
  "3DdpnjIgHK4t5NAsdJvKge",
  "7spG1hR99gCB43DaEcq9VC",
  "371E8Xx0OCWGAbOddxvo4i",
  "1zibZkbO2SMtSecGzOqN9B",
  "1JEfGq3ZWwHLHpc4wBY5u6",
  "2S3LlMagL19C8pK1IaYdxO",
  "2VAdtyPDgPCPbU4DN69IDh",
  "3xf2LGiuagiArtFNXyNatL",
  "7eDCvhuP21p1YXAKkChdrU",
  "5q7xK2SeMg4gFl88pSmSp7",
  "6ztt4FMa6HCfNdoH96Ppyx",
  "65PrxT7e9ipgwLwh1Br5sI",
  "1kTb0z5lNHCmDVhG5bBHfd",
  "6fRMUid0WLu0Sombj0hUos",
  "1VQrgjJAcMg7tUwsw0N88n",
  "7bXFrbPYbZkD2VZ0Xt5Gbd",
  "46oCcyR5QpWw5Ho1qi0sQK",
  "0rTaDlcde6sL7GMOdsMQGA",
  "63VSlAMiTWTbT89AXEdjah",
  "0kWHKnSLYLbnZKmTwCckxH",
];

/**
 * GET /spotify/hall-of-fame
 * Returns a curated list of all-time favourite tracks.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {Promise<void>}
 */
app.get("/spotify/hall-of-fame", async (req, res) => {
  try {
    const { access_token } = await getAccessToken();

    const response = await fetch(
      `https://api.spotify.com/v1/tracks?ids=${HALL_OF_FAME_IDS.join(",")}`,
      { headers: { Authorization: `Bearer ${access_token}` } },
    );

    if (response.status > 400) {
      const errBody = await response.text();
      console.error("Spotify Hall of Fame status:", response.status, errBody);
      return res
        .status(502)
        .json({ error: "Spotify API error", status: response.status });
    }

    const data = await response.json();

    const tracks = data.tracks.map((item, index) => ({
      index,
      title: item.name,
      artist: item.artists.map((a) => a.name).join(", "),
      album: item.album.name,
      albumArt: item.album.images[0]?.url || "",
      url: item.external_urls.spotify,
      previewUrl: item.preview_url || null,
      duration: item.duration_ms,
      popularity: item.popularity,
      releaseDate: item.album.release_date,
    }));

    return res.json({ tracks });
  } catch (error) {
    console.error("Spotify Hall of Fame Error:", error);
    return res.status(500).json({ error: "Failed to fetch hall of fame" });
  }
});

/* Contact */
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  handler: (req, res) => {
    res.status(429).json({
      error: "Too many requests. Please try again later.",
    });
  },
});

const schema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  message: z.string().min(10).max(2000),
});

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

/**
 * POST /contact
 * Validates input and sends a contact form email via SMTP.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {Promise<void>}
 */
app.post("/contact", limiter, async (req, res) => {
  try {
    const data = schema.parse(req.body);

    await transporter.sendMail({
      from: process.env.MAIL_FROM,
      to: process.env.MAIL_TO,
      replyTo: data.email,
      subject: `Contact form – ${data.name}`,
      text: [
        `New message from bbastian.dev`,
        `─────────────────────────────`,
        `Name    ${data.name}`,
        `Email   ${data.email}`,
        `─────────────────────────────`,
        ``,
        data.message,
        ``,
        `─────────────────────────────`,
        `Sent via bbastian.dev/contact`,
      ].join("\n"),
      html: `
        <div style="font-family:system-ui,sans-serif;max-width:560px;margin:0 auto;background:#0a0a0a;border-radius:12px;overflow:hidden;border:1px solid #222">
          <div style="padding:24px 28px;border-bottom:1px solid #1a1a1a">
            <span style="font-family:monospace;font-size:15px;color:#34d399;font-weight:700">&lt;B/&gt;</span>
            <span style="font-size:13px;color:#555;margin-left:10px">bbastian.dev · contact form</span>
          </div>
          <div style="padding:28px">
            <table style="width:100%;border-collapse:collapse;margin-bottom:24px">
              <tr>
                <td style="padding:8px 0;color:#555;font-size:12px;text-transform:uppercase;letter-spacing:.08em;width:64px">Name</td>
                <td style="padding:8px 0;color:#fff;font-size:14px;font-weight:600">${data.name}</td>
              </tr>
              <tr>
                <td style="padding:8px 0;color:#555;font-size:12px;text-transform:uppercase;letter-spacing:.08em">Email</td>
                <td style="padding:8px 0"><a href="mailto:${data.email}" style="color:#34d399;font-size:14px;text-decoration:none">${data.email}</a></td>
              </tr>
            </table>
            <div style="background:#111;border:1px solid #1f1f1f;border-radius:8px;padding:18px 20px">
              <p style="margin:0;color:#999;font-size:11px;text-transform:uppercase;letter-spacing:.08em;margin-bottom:12px">Message</p>
              <p style="margin:0;color:#e5e5e5;font-size:14px;line-height:1.7;white-space:pre-wrap">${data.message}</p>
            </div>
          </div>
          <div style="padding:16px 28px;border-top:1px solid #1a1a1a;text-align:right">
            <span style="font-size:11px;color:#333">bbastian.dev/contact</span>
          </div>
        </div>
      `,
    });

    res.json({ success: true });
  } catch (err) {
    console.error("Contact API Error:", err);
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: "Invalid input" });
    }
    res.status(500).json({ error: "Mail failed" });
  }
});

/**
 * POST /noury/waitlist
 * Adds an email to the Noury waitlist.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {Promise<void>}
 */
app.post("/noury/waitlist", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res
      .status(500)
      .json({ success: false, message: "missing required fields." });
  }

  try {
    const [rows] = await db.execute(
      `
      INSERT INTO noury_wait_list
      (email) VALUES (?)
      `,
      [email],
    );

    if (rows.affectedRows === 1) {
      return res
        .status(200)
        .json({ success: true, message: "email signed up." });
    }
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY")
      return res
        .status(400)
        .json({ success: false, message: "email already signed up." });

    return res
      .status(500)
      .json({ success: false, message: "internal server error.", error: err });
  }
});

app.get("/noury/waitlist/count", async (req, res) => {
  try {
    const [rows] = await db.execute(
      `
      SELECT COUNT(*) AS count FROM noury_wait_list
      `,
    );

    res.json({ count: rows[0].count });
  } catch (err) {
    console.error("Waitlist count error:", err);
    res.status(500).json({ error: "internal server error." });
  }
});

/* ── Leaderboard ─────────────────────────────────────────────────────────── */

const leaderboardLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 10,
  handler: (_req, res) =>
    res.status(429).json({ error: "Too many submissions. Try again later." }),
});

const nameSchema = z
  .string()
  .min(1)
  .max(20)
  .regex(/^[^\s].*/, "Name can't start with a space");

/**
 * GET /leaderboard/minesweeper?difficulty=beginner
 * Returns top 10 scores for a difficulty, sorted by fastest time.
 */
app.get("/leaderboard/minesweeper", async (req, res) => {
  const allowed = ["beginner", "intermediate", "expert"];
  const difficulty = allowed.includes(req.query.difficulty)
    ? req.query.difficulty
    : "beginner";

  try {
    const [rows] = await db.execute(
      `SELECT id, name, time_secs, difficulty, created_at
       FROM minesweeper_scores
       WHERE difficulty = ?
       ORDER BY time_secs ASC
       LIMIT 10`,
      [difficulty],
    );
    res.json({ scores: rows, difficulty });
  } catch (err) {
    console.error("Minesweeper leaderboard GET error:", err);
    res.status(500).json({ error: "internal server error" });
  }
});

/**
 * POST /leaderboard/minesweeper
 * Body: { name, time_secs, difficulty }
 */
app.post("/leaderboard/minesweeper", leaderboardLimiter, async (req, res) => {
  try {
    const name = nameSchema.parse((req.body.name ?? "").trim());
    const time_secs = z
      .number()
      .int()
      .min(1)
      .max(9999)
      .parse(Number(req.body.time_secs));
    const difficulty = z
      .enum(["beginner", "intermediate", "expert"])
      .parse(req.body.difficulty);

    await db.execute(
      `INSERT INTO minesweeper_scores (name, time_secs, difficulty) VALUES (?, ?, ?)`,
      [name, time_secs, difficulty],
    );
    res.json({ success: true });
  } catch (err) {
    if (err instanceof z.ZodError)
      return res.status(400).json({ error: "Invalid input" });
    console.error("Minesweeper leaderboard POST error:", err);
    res.status(500).json({ error: "internal server error" });
  }
});

/**
 * GET /leaderboard/snake
 * Returns top 10 scores, sorted by highest score.
 */
app.get("/leaderboard/snake", async (req, res) => {
  try {
    const [rows] = await db.execute(
      `SELECT id, name, score, created_at
       FROM snake_scores
       ORDER BY score DESC
       LIMIT 10`,
    );
    res.json({ scores: rows });
  } catch (err) {
    console.error("Snake leaderboard GET error:", err);
    res.status(500).json({ error: "internal server error" });
  }
});

/**
 * POST /leaderboard/snake
 * Body: { name, score }
 */
app.post("/leaderboard/snake", leaderboardLimiter, async (req, res) => {
  try {
    const name = nameSchema.parse((req.body.name ?? "").trim());
    const score = z
      .number()
      .int()
      .min(10)
      .max(99999)
      .parse(Number(req.body.score));

    await db.execute(`INSERT INTO snake_scores (name, score) VALUES (?, ?)`, [
      name,
      score,
    ]);
    res.json({ success: true });
  } catch (err) {
    if (err instanceof z.ZodError)
      return res.status(400).json({ error: "Invalid input" });
    console.error("Snake leaderboard POST error:", err);
    res.status(500).json({ error: "internal server error" });
  }
});

function normalizeWord(input) {
  return (
    String(input)
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")

      // deutsche Zeichen
      .replace(/ä/g, "ae")
      .replace(/ö/g, "oe")
      .replace(/ü/g, "ue")
      .replace(/ß/g, "ss")

      // Leetspeak / Sonderzeichen ersetzen
      .replace(/[@]/g, "a")
      .replace(/[4]/g, "a")
      .replace(/[8]/g, "b")
      .replace(/[3]/g, "e")
      .replace(/[1!|]/g, "i")
      .replace(/[0]/g, "o")
      .replace(/[5$]/g, "s")
      .replace(/[7]/g, "t")
      .replace(/[+]/g, "t")

      // alles entfernen außer Buchstaben und Zahlen
      // dadurch wird aus "f u c k" => "fuck"
      // und aus "a-s-s" => "ass"
      .replace(/[^a-z0-9]/g, "")

      .trim()
  );
}

const normalizeBadWords = [
  ...new Set(
    bannedWords.words.map((word) => normalizeWord(word)).filter(Boolean),
  ),
];

function isBannedWord(input) {
  const normalizedInput = normalizeWord(input);

  return normalizeBadWords.includes(normalizedInput);
}

function validateSubmittedWord(input) {
  const originalWord = String(input).trim();
  const normalizedWord = normalizeWord(originalWord);

  if (!originalWord) {
    return {
      valid: false,
      reason: "Please input a value.",
    };
  }

  if (originalWord.length < 2) {
    return {
      valid: false,
      reason: "The word is too short.",
    };
  }

  if (originalWord.length > 51) {
    return {
      valid: false,
      reason: "The word is too long.",
    };
  }

  // Enforce a *single* word — no spaces, tabs or line breaks allowed.
  if (/\s/.test(originalWord)) {
    return {
      valid: false,
      reason: "Please enter only a single word.",
    };
  }

  if (isBannedWord(originalWord)) {
    return {
      valid: false,
      reason: "The word is banned.",
    };
  }

  return {
    valid: true,
    word: originalWord,
    normalizedWord,
  };
}

const leaveAWordLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3,
  keyGenerator: (req) => {
    const cookies = parseCookies(req);
    return cookies.visitor_id || req.ip;
  },
  handler: (_req, res) =>
    res.status(429).json({ error: "Too many submissions. Try again later." }),
});

const leaveAWordNameSchema = z
  .string()
  .min(2, "Name must be at least 2 characters.")
  .max(30, "Name is too long.")
  .regex(/^\S.*\S$|^\S$/, "Name can't start or end with a space.")
  // No line breaks or tabs — keeps it to a name, not a pasted block of text.
  .refine((v) => !/[\n\r\t]/.test(v), {
    message: "Name contains invalid characters.",
  })
  // A name, not a sentence: at most 3 whitespace-separated parts.
  .refine((v) => v.split(/\s+/).filter(Boolean).length <= 3, {
    message: "Please enter a name, not a sentence.",
  });

app.post("/leave-a-word", leaveAWordLimiter, async (req, res) => {
  const cookies = parseCookies(req);
  let visitorId = cookies.visitor_id;
  if (!visitorId) {
    visitorId = randomUUID();
    res.cookie("visitor_id", visitorId, {
      maxAge: 365 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "lax",
      path: "/",
    });
  }

  const { name, message } = req.body;

  if (!name || !message) {
    return res
      .status(400)
      .json({ success: false, message: "name and message are required." });
  }

  try {
    const validatedName = leaveAWordNameSchema.parse(String(name).trim());

    if (isBannedWord(validatedName)) {
      return res
        .status(400)
        .json({ success: false, message: "That name is not allowed." });
    }

    const validation = validateSubmittedWord(message);

    if (!validation.valid) {
      return res
        .status(400)
        .json({ success: false, message: validation.reason });
    }

    await db.execute(`INSERT INTO leave_a_word (name, word) VALUES (?, ?)`, [
      validatedName,
      validation.word,
    ]);

    return res
      .status(201)
      .json({ success: true, message: "word saved successfully." });
  } catch (err) {
    if (err instanceof z.ZodError)
      return res.status(400).json({
        success: false,
        message: err.errors[0]?.message || "Invalid input.",
      });
    console.error("Leave a Word POST error:", err);
    res.status(500).json({ error: "internal server error" });
  }
});

app.get("/leave-a-word/all", async (req, res) => {
  try {
    const page = Math.max(1, parseInt(String(req.query.page)) || 1);
    const sortDir = req.query.sort === "oldest" ? "ASC" : "DESC";
    const limit = 50;
    const offset = (page - 1) * limit;

    const [[{ total }]] = await db.execute(
      `SELECT COUNT(*) AS total FROM leave_a_word`,
    );

    const [rows] = await db.execute(
      `SELECT lawId, name, word, created_at FROM leave_a_word ORDER BY created_at ${sortDir} LIMIT ? OFFSET ?`,
      [limit, offset],
    );

    return res.status(200).json({
      success: true,
      words: rows,
      total: Number(total),
      page,
      pages: Math.ceil(Number(total) / limit),
    });
  } catch (err) {
    console.error("leave a word GET error:", err);
    res.status(500).json({ error: "internal server error" });
  }
});

/* ── Visitor Counter ─────────────────────────────────────────────────────────
 * Required table:
 * CREATE TABLE visitors (
 *   id         INT AUTO_INCREMENT PRIMARY KEY,
 *   visitor_id VARCHAR(36) NOT NULL UNIQUE,
 *   first_seen DATETIME    NOT NULL DEFAULT NOW()
 * );
 * ──────────────────────────────────────────────────────────────────────────── */

/**
 * POST /visitors/ping
 * Records a unique visitor (deduped by visitor_id cookie) and returns total count.
 */
app.post("/visitors/ping", async (req, res) => {
  const cookies = parseCookies(req);
  let visitorId = cookies.visitor_id;

  if (!visitorId) {
    visitorId = randomUUID();
    res.cookie("visitor_id", visitorId, {
      maxAge: 365 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "lax",
      path: "/",
    });
  }

  try {
    await db.execute(`INSERT IGNORE INTO visitors (visitor_id) VALUES (?)`, [
      visitorId,
    ]);

    const [[{ count }]] = await db.execute(
      `SELECT COUNT(*) AS count FROM visitors`,
    );

    res.json({ count: Number(count) });
  } catch (err) {
    console.error("Visitors ping error:", err);
    res.status(500).json({ error: "internal server error" });
  }
});

/**
 * GET /visitors/count
 * Returns the total unique visitor count.
 */
app.get("/visitors/count", async (req, res) => {
  try {
    const [[{ count }]] = await db.execute(
      `SELECT COUNT(*) AS count FROM visitors`,
    );
    res.json({ count: Number(count) });
  } catch (err) {
    console.error("Visitors count error:", err);
    res.status(500).json({ error: "internal server error" });
  }
});

/* ─────────────────────────────────────────────────────────────────────
 *  Live cursors — WebSocket hub at /cursors
 *
 *  Protocol:
 *    Client → Server:  { x, y }                     (normalized 0–1)
 *    Server → Client:  { type: "state", cursors: [{ id, x, y, color }] }
 *                      { type: "leave", id }
 *
 *  The server assigns each connection a random color, so clients only ever
 *  send their position — the identity comes from here.
 * ───────────────────────────────────────────────────────────────────── */
const CURSOR_COLORS = [
  "#34d399", "#60a5fa", "#f472b6", "#a78bfa", "#fb923c",
  "#facc15", "#38bdf8", "#4ade80", "#f87171", "#c084fc",
];
const CURSOR_MAX_CLIENTS = 200; // abuse guard
const CURSOR_BROADCAST_MS = 50; // ~20 fps state broadcast
const CURSOR_HEARTBEAT_MS = 30000;

const cursorOriginAllowed = (origin) => {
  if (!origin) return false;
  if (allowedOrigins.includes(origin)) return true;
  return /^https:\/\/([\w-]+\.)*bbastian\.dev$/.test(origin);
};

const server = http.createServer(app);
const cursorWss = new WebSocketServer({ noServer: true });

// State per connection: id → { x, y, name, color }
const cursors = new Map();
const cursorSockets = new Map(); // id → ws

server.on("upgrade", (req, socket, head) => {
  let pathname;
  try {
    pathname = new URL(req.url, "http://localhost").pathname;
  } catch {
    socket.destroy();
    return;
  }
  if (pathname !== "/cursors") {
    socket.destroy();
    return;
  }
  if (!cursorOriginAllowed(req.headers.origin)) {
    socket.destroy();
    return;
  }
  cursorWss.handleUpgrade(req, socket, head, (ws) => {
    cursorWss.emit("connection", ws, req);
  });
});

cursorWss.on("connection", (ws) => {
  if (cursorSockets.size >= CURSOR_MAX_CLIENTS) {
    ws.close();
    return;
  }

  const id = randomUUID();
  ws.isAlive = true;
  cursors.set(id, {
    x: 0.5,
    y: 0.5,
    color: CURSOR_COLORS[(Math.random() * CURSOR_COLORS.length) | 0],
  });
  cursorSockets.set(id, ws);

  ws.on("pong", () => {
    ws.isAlive = true;
  });

  ws.on("message", (buf) => {
    let msg;
    try {
      msg = JSON.parse(buf.toString());
    } catch {
      return;
    }
    const c = cursors.get(id);
    if (!c) return;
    if (typeof msg.x === "number" && typeof msg.y === "number") {
      c.x = Math.min(1, Math.max(0, msg.x));
      c.y = Math.min(1, Math.max(0, msg.y));
    }
  });

  const cleanup = () => {
    cursors.delete(id);
    cursorSockets.delete(id);
    const payload = JSON.stringify({ type: "leave", id });
    for (const s of cursorSockets.values())
      if (s.readyState === 1) s.send(payload);
  };
  ws.on("close", cleanup);
  ws.on("error", cleanup);
});

// Broadcast everyone's positions — each client gets everyone *except* itself.
setInterval(() => {
  if (cursorSockets.size === 0) return;
  for (const [id, ws] of cursorSockets) {
    if (ws.readyState !== 1) continue;
    const others = [];
    for (const [oid, c] of cursors) {
      if (oid === id) continue;
      others.push({ id: oid, x: c.x, y: c.y, color: c.color });
    }
    ws.send(JSON.stringify({ type: "state", cursors: others }));
  }
}, CURSOR_BROADCAST_MS);

// Drop dead connections
setInterval(() => {
  for (const ws of cursorSockets.values()) {
    if (ws.isAlive === false) {
      ws.terminate();
      continue;
    }
    ws.isAlive = false;
    try {
      ws.ping();
    } catch {
      /* ignore */
    }
  }
}, CURSOR_HEARTBEAT_MS);

server.listen(process.env.PORT, () => {
  console.log(`Server läuft auf Port ${process.env.PORT}`);
});
