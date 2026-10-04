import { useState } from "react";
import { X } from "lucide-react";

// Versioned key: a future release gets a new key, so the banner shows again.
const STORAGE_KEY = "release_banner_dropnote_v2.9.1_dismissed";
const BLUE = "#3994E7";
const RELEASE_URL = "https://github.com/bastian-js/dropnote/releases/tag/v2.9.1";

function safeLocalStorage(op: "get" | "set", key: string, value?: string) {
  try {
    if (op === "get") return localStorage.getItem(key);
    if (op === "set") localStorage.setItem(key, value!);
  } catch {
    /* ignore private mode / quota errors */
  }
  return null;
}

/** Dismissible release announcement at the top of the homepage. */
function ReleaseBanner() {
  const [visible, setVisible] = useState(
    () => safeLocalStorage("get", STORAGE_KEY) !== "1"
  );

  if (!visible) return null;

  function dismiss() {
    safeLocalStorage("set", STORAGE_KEY, "1");
    setVisible(false);
  }

  return (
    <div className="mx-auto max-w-6xl px-4 pt-6">
      <div
        className="group relative overflow-hidden rounded-2xl bg-linear-to-br from-[#0b1420] via-[#0a0d12] to-[#080d14] transition-colors duration-200"
        style={{ border: `1px solid ${BLUE}40` }}
        onMouseEnter={(e) => (e.currentTarget.style.borderColor = `${BLUE}80`)}
        onMouseLeave={(e) => (e.currentTarget.style.borderColor = `${BLUE}40`)}
      >
        <div className="pointer-events-none absolute -top-10 -right-8 h-32 w-32 rounded-full blur-3xl" style={{ background: `${BLUE}33` }} />
        <div className="pointer-events-none absolute -bottom-12 left-1/4 h-24 w-24 rounded-full bg-indigo-500/10 blur-3xl" />
        <a
          href={RELEASE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="relative flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 px-5 py-4 pr-12"
        >
          <div className="flex items-center gap-3 shrink-0">
            <span
              className="inline-flex items-center gap-2 rounded-full border px-3 py-0.5 text-xs font-bold tracking-[0.18em] uppercase"
              style={{ borderColor: `${BLUE}60`, background: `${BLUE}20`, color: "#a8ccf5", boxShadow: `0 0 16px ${BLUE}33` }}
            >
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: BLUE }} />
              Out Now
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-black text-white">DropNote</span>
              <span className="text-sm font-medium font-mono" style={{ color: "#6fb3f0" }}>
                v2.9.1
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between gap-3 sm:flex-1 min-w-0">
            <p className="text-sm text-gray-400 min-w-0">
              Fixes a typing crash, clearer note tabs and live sync between windows.
            </p>
            <span className="text-xs font-semibold group-hover:underline shrink-0" style={{ color: "#6fb3f0" }}>
              Release notes →
            </span>
          </div>
        </a>
        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss release banner"
          className="absolute top-3 right-3 sm:top-1/2 sm:-translate-y-1/2 p-1.5 rounded-md transition-colors"
          style={{ color: "rgba(255,255,255,0.35)" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.8)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.35)")}
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default ReleaseBanner;
