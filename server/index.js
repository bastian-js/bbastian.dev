import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
app.use(cors());

// GitHub Stats Route
app.get("/api/github-stats", async (req, res) => {
  try {
    const headers = {
      Authorization: `token ${process.env.GITHUB_TOKEN}`,
    };

    const username = process.env.GITHUB_USERNAME;

    // User
    const userRes = await fetch(`https://api.github.com/users/${username}`, {
      headers,
    });
    const user = await userRes.json();

    // Repos
    const reposRes = await fetch(
      `https://api.github.com/users/${username}/repos?per_page=100`,
      { headers }
    );
    const repos = await reposRes.json();

    // Stars
    const stars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);

    // Languages aggregieren
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

    // Account age
    const createdAt = new Date(user.created_at);
    const yearsActive = Math.floor(
      (Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24 * 365)
    );

    res.json({
      repos: repos.length,
      stars,
      yearsActive,
      languages,
    });
  } catch (err) {
    res.status(500).json({ error: "GitHub API failed" });
  }
});

// Spotify API credentials
const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const SPOTIFY_REFRESH_TOKEN = process.env.SPOTIFY_REFRESH_TOKEN;

const basic = Buffer.from(
  `${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`
).toString("base64");
const NOW_PLAYING_ENDPOINT =
  "https://api.spotify.com/v1/me/player/currently-playing";
const RECENTLY_PLAYED_ENDPOINT =
  "https://api.spotify.com/v1/me/player/recently-played?limit=1";
const TOKEN_ENDPOINT = "https://accounts.spotify.com/api/token";

// Get access token
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

  const data = await response.json();

  if (!data.access_token) {
    throw new Error("No Spotify access token");
  }

  console.log("Spotify token response:", data);

  return data;
}

// Get currently playing track
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

// Get recently played track
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

// Spotify Now Playing Route
app.get("/api/spotify/now-playing", async (req, res) => {
  try {
    const nowPlaying = await getNowPlaying();

    if (nowPlaying && nowPlaying.is_playing) {
      // Currently playing
      const track = nowPlaying.item;
      return res.json({
        status: "playing",
        track: {
          title: track.name,
          artist: track.artists.map((artist) => artist.name).join(", "),
          album: track.album.name,
          albumArt: track.album.images[0]?.url || "",
          isPlaying: nowPlaying.is_playing,
          progress: nowPlaying.progress_ms,
          duration: track.duration_ms,
        },
      });
    } else {
      // Not playing - get last played
      const recentlyPlayed = await getRecentlyPlayed();

      if (
        recentlyPlayed &&
        recentlyPlayed.items &&
        recentlyPlayed.items.length > 0
      ) {
        const track = recentlyPlayed.items[0].track;
        return res.json({
          status: "idle",
          lastPlayed: {
            title: track.name,
            artist: track.artists.map((artist) => artist.name).join(", "),
            albumArt: track.album.images[0]?.url || "",
          },
        });
      } else {
        return res.json({
          status: "idle",
        });
      }
    }
  } catch (error) {
    console.error("Spotify API Error:", error);
    return res.json({
      status: "error",
    });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Server läuft auf Port ${process.env.PORT}`);
});
