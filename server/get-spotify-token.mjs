// Run: node get-spotify-token.mjs
// Then visit the printed URL, authorize, and the new refresh token will be shown.
// Add http://localhost:8888/callback to your Spotify app's redirect URIs first.

import http from "http";
import { exec } from "child_process";
import dotenv from "dotenv";

dotenv.config();

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REDIRECT_URI = "http://localhost:8888/callback";

const SCOPES = [
  "user-read-currently-playing",
  "user-read-recently-played",
  "user-top-read",
].join(" ");

const authUrl =
  "https://accounts.spotify.com/authorize?" +
  new URLSearchParams({
    response_type: "code",
    client_id: CLIENT_ID,
    scope: SCOPES,
    redirect_uri: REDIRECT_URI,
  });

console.log("\n=== Spotify Token Helper ===");
console.log("1. Make sure http://localhost:8888/callback is added in your Spotify App's Redirect URIs");
console.log("2. Opening auth URL in browser...\n");
console.log(authUrl);

exec(`open "${authUrl}"`);

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, "http://localhost:8888");
  const code = url.searchParams.get("code");

  if (!code) {
    res.end("No code found.");
    return;
  }

  const basic = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64");

  const tokenRes = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: REDIRECT_URI,
    }),
  });

  const data = await tokenRes.json();

  if (!data.refresh_token) {
    console.error("Error:", data);
    res.end("Error getting token. Check terminal.");
    server.close();
    return;
  }

  console.log("\n✅ New refresh token:");
  console.log(data.refresh_token);
  console.log("\nUpdate SPOTIFY_REFRESH_TOKEN in your server/.env with the value above.");

  res.end("Got it! Check your terminal for the new refresh token. You can close this tab.");
  server.close();
});

server.listen(8888, () => {
  console.log("\nWaiting for Spotify callback on http://localhost:8888/callback ...");
});
