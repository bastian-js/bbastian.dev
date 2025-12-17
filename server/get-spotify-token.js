// get-spotify-token.js
// Run: node get-spotify-token.js

import fetch from "node-fetch";
import express from "express";
import open from "open";

// FÜGE DEINE CREDENTIALS HIER EIN:
const CLIENT_ID = "3998d032dd69416e99b1d1fd1ab9cc6b";
const CLIENT_SECRET = "8753d0beb1dd482494b2cb8b897c2fff";
const REDIRECT_URI = "http://127.0.0.1:8888/callback";

const app = express();
const PORT = 8888;

const scopes = [
  "user-read-currently-playing",
  "user-read-recently-played",
].join(" ");

// Step 1: Open authorization URL
const authUrl =
  `https://accounts.spotify.com/authorize?` +
  `client_id=${CLIENT_ID}&` +
  `response_type=code&` +
  `redirect_uri=${encodeURIComponent(REDIRECT_URI)}&` +
  `scope=${encodeURIComponent(scopes)}`;

console.log("\n🎵 Spotify Refresh Token Generator\n");
console.log("1. Browser öffnet sich automatisch...");
console.log("2. Melde dich bei Spotify an und gib die Erlaubnis");
console.log("3. Du wirst zurück geleitet und bekommst deinen Token!\n");

// Step 2: Handle callback
app.get("/callback", async (req, res) => {
  const code = req.query.code;

  if (!code) {
    res.send("❌ Fehler: Kein Code erhalten!");
    return;
  }

  try {
    // Step 3: Exchange code for tokens
    const basic = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString(
      "base64"
    );

    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${basic}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code: code,
        redirect_uri: REDIRECT_URI,
      }),
    });

    const data = await response.json();

    if (data.refresh_token) {
      console.log("\n✅ SUCCESS! Dein Refresh Token:\n");
      console.log("═══════════════════════════════════════════════════════");
      console.log(data.refresh_token);
      console.log("═══════════════════════════════════════════════════════\n");
      console.log("📝 Füge diesen Token in deine .env Datei ein:");
      console.log(`SPOTIFY_REFRESH_TOKEN=${data.refresh_token}\n`);

      res.send(`
        <html>
          <head>
            <style>
              body {
                font-family: Arial, sans-serif;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                margin: 0;
                background: #1DB954;
                color: white;
              }
              .container {
                text-align: center;
                padding: 40px;
                background: rgba(0,0,0,0.3);
                border-radius: 20px;
              }
              .token {
                background: rgba(0,0,0,0.5);
                padding: 20px;
                border-radius: 10px;
                margin: 20px 0;
                word-break: break-all;
                font-family: monospace;
              }
              h1 { font-size: 48px; margin: 0; }
              p { font-size: 18px; }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>✅ Erfolg!</h1>
              <p>Dein Refresh Token:</p>
              <div class="token">${data.refresh_token}</div>
              <p>Schau in dein Terminal für weitere Infos!</p>
              <p style="margin-top: 30px; opacity: 0.7;">Du kannst dieses Fenster jetzt schließen.</p>
            </div>
          </body>
        </html>
      `);

      setTimeout(() => {
        console.log("Server wird geschlossen...");
        process.exit(0);
      }, 2000);
    } else {
      console.error("❌ Fehler:", data);
      res.send("❌ Fehler beim Abrufen des Tokens. Schau ins Terminal!");
    }
  } catch (error) {
    console.error("❌ Fehler:", error);
    res.send("❌ Ein Fehler ist aufgetreten. Schau ins Terminal!");
  }
});

// Start server and open browser
app.listen(PORT, async () => {
  console.log(`Server läuft auf http://localhost:${PORT}`);
  console.log("Browser öffnet sich...\n");

  // Wait a bit then open browser
  setTimeout(() => {
    open(authUrl);
  }, 1000);
});
