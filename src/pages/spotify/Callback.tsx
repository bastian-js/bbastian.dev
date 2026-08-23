import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const API = "https://api.bbastian.dev";

type ExchangeResult = {
  account: string | null;
  expiresAt: string | null;
};

function SpotifyCallback() {
  const location = useLocation();
  const [result, setResult] = useState<ExchangeResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const code = params.get("code");
    const state = params.get("state");
    const denied = params.get("error");

    if (denied) {
      setError(`Spotify returned: ${denied}`);
      setLoading(false);
      return;
    }
    if (!code || !state) {
      setError("Missing authorization code or state in URL.");
      setLoading(false);
      return;
    }

    fetch(
      `${API}/spotify/exchange?code=${encodeURIComponent(code)}&state=${encodeURIComponent(state)}`,
    )
      .then((r) => r.json())
      .then((data) => {
        if (data.stored) {
          setResult({ account: data.account ?? null, expiresAt: data.expiresAt ?? null });
        } else {
          setError(data.error ? String(data.error) : JSON.stringify(data));
        }
        setLoading(false);
      })
      .catch((e) => {
        setError(e.message);
        setLoading(false);
      });
  }, []);

  const expiryLabel = result?.expiresAt
    ? new Date(result.expiresAt).toLocaleDateString("de-AT", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center px-4">
      <div className="w-full max-w-xl bg-[#111] border border-white/6 rounded-2xl p-8">
        <p className="text-xs font-mono text-emerald-400 mb-4 uppercase tracking-widest">
          Spotify OAuth
        </p>

        {loading && (
          <p className="text-gray-400 text-sm">Exchanging code for token...</p>
        )}

        {error && (
          <div>
            <p className="text-red-400 text-sm mb-2">Error:</p>
            <pre className="text-xs text-gray-500 break-all whitespace-pre-wrap">
              {error}
            </pre>
          </div>
        )}

        {result && (
          <div>
            <p className="text-emerald-400 text-sm mb-3">
              Refresh token stored on the server — nothing to copy.
            </p>
            {result.account && (
              <p className="text-gray-400 text-sm">
                Connected account:{" "}
                <span className="text-white">{result.account}</span>
              </p>
            )}
            {expiryLabel && (
              <p className="text-gray-400 text-sm mt-1">
                Valid until <span className="text-white">{expiryLabel}</span> —
                Spotify expires refresh tokens after 6 months, so this has to be
                repeated then.
              </p>
            )}
            <p className="text-gray-600 text-xs mt-4">
              No restart needed. Check{" "}
              <code className="text-emerald-400">/spotify/status</code> to
              verify.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default SpotifyCallback;
