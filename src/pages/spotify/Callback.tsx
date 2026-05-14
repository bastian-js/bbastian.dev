import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

function SpotifyCallback() {
  const location = useLocation();
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const code = new URLSearchParams(location.search).get("code");
    if (!code) {
      setError("No authorization code in URL.");
      setLoading(false);
      return;
    }

    fetch(`https://api.bbastian.dev/spotify/exchange?code=${code}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.refresh_token) {
          setToken(data.refresh_token);
        } else {
          setError(JSON.stringify(data));
        }
        setLoading(false);
      })
      .catch((e) => {
        setError(e.message);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center px-4">
      <div className="w-full max-w-xl bg-[#111] border border-white/6 rounded-2xl p-8">
        <p className="text-xs font-mono text-emerald-400 mb-4 uppercase tracking-widest">Spotify OAuth</p>
        {loading && <p className="text-gray-400 text-sm">Exchanging code for token...</p>}
        {error && (
          <div>
            <p className="text-red-400 text-sm mb-2">Error:</p>
            <pre className="text-xs text-gray-500 break-all whitespace-pre-wrap">{error}</pre>
          </div>
        )}
        {token && (
          <div>
            <p className="text-gray-400 text-sm mb-3">New Refresh Token — copy this into your server <code className="text-emerald-400">.env</code>:</p>
            <pre className="text-xs text-emerald-400 bg-black/40 rounded-xl p-4 break-all whitespace-pre-wrap select-all">{token}</pre>
            <p className="text-gray-600 text-xs mt-4">Update <code>SPOTIFY_REFRESH_TOKEN</code> and restart the server.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default SpotifyCallback;
