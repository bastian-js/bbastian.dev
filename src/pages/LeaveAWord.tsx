import { useState, useEffect } from "react";
import { MessageSquarePlus, ChevronDown, ArrowUp } from "lucide-react";
import FadeIn from "../components/FadeIn";

const API = "https://api.bbastian.dev";

interface Word {
  id: number;
  name: string;
  word: string;
  created_at: string;
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const s = Math.floor(diff / 1000);
  if (s < 60) return "just now";
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d}d ago`;
  const mo = Math.floor(d / 30);
  if (mo < 12) return `${mo}mo ago`;
  return `${Math.floor(mo / 12)}y ago`;
}

function avatarColor(name: string) {
  const colors = [
    "#34d399",
    "#60a5fa",
    "#f472b6",
    "#a78bfa",
    "#fb923c",
    "#facc15",
    "#38bdf8",
    "#4ade80",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++)
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

function WordCard({ word, index }: { word: Word; index: number }) {
  const color = avatarColor(word.name);
  const initial = word.name.charAt(0).toUpperCase();

  return (
    <FadeIn delay={index * 40}>
      <div
        className="flex gap-4 py-5"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
      >
        {/* Avatar */}
        <div
          className="shrink-0 w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm select-none"
          style={{
            background: color + "22",
            color,
            border: `1.5px solid ${color}44`,
          }}
        >
          {initial}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-sm font-semibold text-white">
              {word.name}
            </span>
            <span className="text-xs text-gray-600 font-mono">
              {timeAgo(word.created_at)}
            </span>
          </div>
          <p
            className="text-base font-medium leading-snug break-words"
            style={{ color: "rgba(255,255,255,0.85)" }}
          >
            {word.word}
          </p>
        </div>
      </div>
    </FadeIn>
  );
}

function safeLocalStorage(
  op: "get" | "set" | "remove",
  key: string,
  value?: string,
) {
  try {
    if (op === "get") return localStorage.getItem(key);
    if (op === "set") localStorage.setItem(key, value!);
    if (op === "remove") localStorage.removeItem(key);
  } catch {
    /* ignore private mode / quota errors */
  }
  return null;
}

export default function LeaveAWord() {
  const [words, setWords] = useState<Word[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [sort, setSort] = useState<"newest" | "oldest">("newest");
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const [name, setName] = useState("");
  const [word, setWord] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (safeLocalStorage("get", "law_submitted") === "1") setSubmitted(true);
  }, []);

  useEffect(() => {
    fetchWords(1, sort, true);
  }, [sort]);

  async function fetchWords(p: number, s: string, reset = false) {
    if (p === 1) setLoading(true);
    else setLoadingMore(true);
    try {
      const res = await fetch(`${API}/leave-a-word/all?page=${p}&sort=${s}`);
      const data = await res.json();
      if (reset || p === 1) {
        setWords(data.words ?? []);
      } else {
        setWords((prev) => [...prev, ...(data.words ?? [])]);
      }
      setTotal(data.total ?? 0);
      setPage(p);
      setPages(data.pages ?? 1);
    } catch {
      /* network error — silently fail */
    }
    setLoading(false);
    setLoadingMore(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting) return;
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch(`${API}/leave-a-word`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name: name.trim(), message: word.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        safeLocalStorage("set", "law_submitted", "1");
        setSubmitted(true);
        fetchWords(1, sort, true);
      } else {
        setError(data.message || data.error || "Something went wrong.");
      }
    } catch {
      setError("Network error. Please try again.");
    }
    setSubmitting(false);
  }

  const handleSortChange = (newSort: "newest" | "oldest") => {
    if (newSort === sort) return;
    setSort(newSort);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white text-left pt-28 pb-24 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <FadeIn>
          <div className="flex items-end justify-between gap-4 mb-4">
            <h1
              className="font-black tracking-tight text-white leading-none"
              style={{ fontSize: "clamp(36px, 7vw, 56px)" }}
            >
              Leave a Word
            </h1>
            <span
              className="text-xs font-mono mb-1 shrink-0"
              style={{ color: "rgba(255,255,255,0.2)" }}
            >
              {total > 0 ? `${total.toString().padStart(2, "0")} words` : "—"}
            </span>
          </div>
          <p className="text-gray-500 text-sm leading-relaxed max-w-md mb-10">
            Drop any word you want — an idea, a feeling, something random. Just
            one word per person.
          </p>
        </FadeIn>

        {/* Submit form */}
        <FadeIn delay={60}>
          <div
            className="rounded-xl p-5 mb-10"
            style={{
              background: "#111",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            {submitted ? (
              <div className="flex items-center gap-3 py-1">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: "#34d39918", color: "#34d399" }}
                >
                  <MessageSquarePlus className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Word left.</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Thanks for leaving a word.
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    maxLength={50}
                    className="flex-1 min-w-0 bg-[#0a0a0a] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-600 outline-none focus:border-white/20 transition-colors"
                  />
                  <input
                    type="text"
                    placeholder="Your word"
                    value={word}
                    onChange={(e) => setWord(e.target.value)}
                    maxLength={51}
                    className="flex-1 min-w-0 bg-[#0a0a0a] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-600 outline-none focus:border-white/20 transition-colors"
                  />
                </div>

                {error && <p className="text-xs text-red-400">{error}</p>}

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={submitting || !name.trim() || !word.trim()}
                    className="cursor-pointer flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{
                      background: "#34d39918",
                      color: "#34d399",
                      border: "1px solid #34d39930",
                    }}
                    onMouseEnter={(e) => {
                      if (!submitting)
                        (e.currentTarget as HTMLElement).style.background =
                          "#34d39930";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.background =
                        "#34d39918";
                    }}
                  >
                    <MessageSquarePlus className="w-3.5 h-3.5" />
                    {submitting ? "Submitting…" : "Leave a word"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </FadeIn>

        {/* Sort bar */}
        <FadeIn delay={80}>
          <div
            className="flex items-center gap-1 mb-2"
            style={{
              borderBottom: "1px solid rgba(255,255,255,0.07)",
              paddingBottom: "12px",
            }}
          >
            <span className="text-xs text-gray-600 mr-2 font-mono uppercase tracking-widest">
              Sort
            </span>
            {(["newest", "oldest"] as const).map((s) => (
              <button
                key={s}
                onClick={() => handleSortChange(s)}
                className="cursor-pointer flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-colors duration-150"
                style={{
                  background:
                    sort === s ? "rgba(255,255,255,0.08)" : "transparent",
                  color: sort === s ? "#fff" : "rgba(255,255,255,0.3)",
                  border:
                    sort === s
                      ? "1px solid rgba(255,255,255,0.1)"
                      : "1px solid transparent",
                }}
              >
                {s === "newest" ? (
                  <ChevronDown className="w-3 h-3" />
                ) : (
                  <ArrowUp className="w-3 h-3" />
                )}
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        </FadeIn>

        {/* Word list */}
        {loading ? (
          <div className="space-y-5 pt-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="flex gap-4 py-5 animate-pulse"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
              >
                <div className="w-9 h-9 rounded-full bg-white/5 shrink-0" />
                <div className="flex-1 space-y-2 pt-1">
                  <div className="h-3 bg-white/5 rounded w-32" />
                  <div className="h-4 bg-white/5 rounded w-48" />
                </div>
              </div>
            ))}
          </div>
        ) : words.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-gray-600 text-sm">No words yet. Be the first.</p>
          </div>
        ) : (
          <div>
            {words.map((w, i) => (
              <WordCard key={w.id} word={w} index={i} />
            ))}

            {page < pages && (
              <div className="pt-8 flex justify-center">
                <button
                  onClick={() => fetchWords(page + 1, sort)}
                  disabled={loadingMore}
                  className="cursor-pointer px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 disabled:opacity-40"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    color: "rgba(255,255,255,0.5)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "rgba(255,255,255,0.5)")
                  }
                >
                  {loadingMore
                    ? "Loading…"
                    : `Load more · ${total - words.length} remaining`}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
