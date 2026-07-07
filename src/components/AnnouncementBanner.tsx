import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Sparkles, X } from "lucide-react";

const STORAGE_KEY = "law_banner_dismissed";

function safeLocalStorage(op: "get" | "set", key: string, value?: string) {
  try {
    if (op === "get") return localStorage.getItem(key);
    if (op === "set") localStorage.setItem(key, value!);
  } catch {
    /* ignore private mode / quota errors */
  }
  return null;
}

/**
 * Small announcement banner ("cookie"-style, but stores no cookie — just a
 * localStorage flag) that nudges visitors toward the Leave a Word feature.
 * Once dismissed it stays hidden forever on that device.
 */
export default function AnnouncementBanner() {
  const { pathname } = useLocation();
  const [visible, setVisible] = useState(false);
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    // Never show it on the page it points to.
    if (pathname === "/leave-a-word") return;
    if (safeLocalStorage("get", STORAGE_KEY) === "1") return;

    setVisible(true);
    // Trigger the slide-in on the next frame.
    const id = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(id);
  }, [pathname]);

  function dismiss() {
    safeLocalStorage("set", STORAGE_KEY, "1");
    setEntered(false);
    // Let the slide-out animation play before unmounting.
    setTimeout(() => setVisible(false), 250);
  }

  if (!visible) return null;

  return (
    <div
      className="fixed z-50 bottom-4 left-4 right-4 sm:left-auto sm:w-[340px]"
      style={{
        transform: entered ? "translateY(0)" : "translateY(140%)",
        opacity: entered ? 1 : 0,
        transition: "transform 0.35s cubic-bezier(0.16,1,0.3,1), opacity 0.35s ease",
      }}
      role="region"
      aria-label="Announcement"
    >
      <div
        className="rounded-xl p-4 shadow-2xl"
        style={{
          background: "#111",
          border: "1px solid rgba(255,255,255,0.09)",
          boxShadow: "0 12px 40px -8px rgba(0,0,0,0.7)",
        }}
      >
        {/* Header row */}
        <div className="flex items-start gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: "#34d39918", color: "#34d399" }}
          >
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-white leading-tight">
                Leave a Word
              </h2>
              <span
                className="text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-full"
                style={{ background: "#34d39918", color: "#34d399" }}
              >
                New
              </span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed mt-1.5">
              Drop a single word — an idea, a feeling, something random — and
              see what everyone else left behind.
            </p>
          </div>
          <button
            onClick={dismiss}
            aria-label="Close announcement"
            className="cursor-pointer -mt-1 -mr-1 p-1 rounded-md text-gray-600 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 mt-3.5">
          <Link
            to="/leave-a-word"
            onClick={dismiss}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-150"
            style={{
              background: "#34d39918",
              color: "#34d399",
              border: "1px solid #34d39930",
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLElement).style.background = "#34d39930")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLElement).style.background = "#34d39918")
            }
          >
            <Sparkles className="w-3.5 h-3.5" />
            Leave a word
          </Link>
          <button
            onClick={dismiss}
            className="cursor-pointer px-3 py-2 rounded-lg text-xs font-medium transition-colors duration-150"
            style={{
              background: "rgba(255,255,255,0.04)",
              color: "rgba(255,255,255,0.45)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLElement).style.color = "#fff")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLElement).style.color =
                "rgba(255,255,255,0.45)")
            }
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
