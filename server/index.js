import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import cors from "cors";
import rateLimit from "express-rate-limit";
import nodemailer from "nodemailer";
import { z } from "zod";
import { db } from "./db.js";

dotenv.config();

const app = express();
const allowedOrigins = ["http://localhost:3030", "http://localhost:5173"];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(new Error("No origin"), false);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      if (/^https:\/\/([\w-]+\.)*bbastian\.dev$/.test(origin))
        return callback(null, true);
      callback(new Error("Not allowed by CORS"), false);
    },
  }),
);
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

    const lastActive = repos
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
const TOKEN_ENDPOINT = "https://accounts.spotify.com/api/token";

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
      text: `
Name: ${data.name}
Email: ${data.email}

${data.message}
      `.trim(),
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

app.listen(process.env.PORT, () => {
  console.log(`Server läuft auf Port ${process.env.PORT}`);
});
