import { useState, useEffect, useCallback, useRef } from "react";
import { X, RotateCcw, Trophy } from "lucide-react";

const GRID = 20;
const CELL = 22;
const API = "https://api.bbastian.dev";

type Dir = "UP" | "DOWN" | "LEFT" | "RIGHT";
type Pos = { x: number; y: number };
type GameState = "idle" | "playing" | "dead";
type View = "game" | "scores";

const OPPOSITE: Record<Dir, Dir> = { UP: "DOWN", DOWN: "UP", LEFT: "RIGHT", RIGHT: "LEFT" };

interface Score { id: number; name: string; score: number; created_at: string }

function randomFood(snake: Pos[]): Pos {
  let pos: Pos;
  do {
    pos = { x: Math.floor(Math.random() * GRID), y: Math.floor(Math.random() * GRID) };
  } while (snake.some((s) => s.x === pos.x && s.y === pos.y));
  return pos;
}

interface Props { onClose: () => void }

export default function Snake({ onClose }: Props) {
  const snakeRef = useRef<Pos[]>([{ x: 10, y: 10 }]);
  const dirRef = useRef<Dir>("RIGHT");
  const pendingRef = useRef<Dir>("RIGHT");
  const foodRef = useRef<Pos>({ x: 15, y: 10 });
  const scoreRef = useRef(0);

  const [gameState, setGameState] = useState<GameState>("idle");
  const [highScore, setHighScore] = useState(() => Number(localStorage.getItem("snake-hs")) || 0);
  const [, tick] = useState(0);
  const [view, setView] = useState<View>("game");

  // leaderboard state
  const [scores, setScores] = useState<Score[]>([]);
  const [scoresLoading, setScoresLoading] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const reset = useCallback(() => {
    snakeRef.current = [{ x: 10, y: 10 }];
    dirRef.current = "RIGHT";
    pendingRef.current = "RIGHT";
    foodRef.current = { x: 15, y: 10 };
    scoreRef.current = 0;
    setGameState("idle");
    setSubmitted(false);
    setNameInput("");
    tick((n) => n + 1);
  }, []);

  const fetchScores = useCallback(async () => {
    setScoresLoading(true);
    try {
      const res = await fetch(`${API}/leaderboard/snake`);
      const data = await res.json();
      setScores(data.scores ?? []);
    } catch {
      setScores([]);
    } finally {
      setScoresLoading(false);
    }
  }, []);

  useEffect(() => {
    if (view === "scores") fetchScores();
  }, [view, fetchScores]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const map: Record<string, Dir> = {
        ArrowUp: "UP", ArrowDown: "DOWN", ArrowLeft: "LEFT", ArrowRight: "RIGHT",
        w: "UP", s: "DOWN", a: "LEFT", d: "RIGHT",
        W: "UP", S: "DOWN", A: "LEFT", D: "RIGHT",
      };
      const newDir = map[e.key];
      if (!newDir) return;
      e.preventDefault();
      if (newDir !== OPPOSITE[dirRef.current]) pendingRef.current = newDir;
      setGameState((gs) => (gs === "idle" ? "playing" : gs));
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    if (gameState !== "playing") return;
    const interval = setInterval(() => {
      dirRef.current = pendingRef.current;
      const d = dirRef.current;
      const head = snakeRef.current[0];
      const newHead: Pos = {
        x: (head.x + (d === "RIGHT" ? 1 : d === "LEFT" ? -1 : 0) + GRID) % GRID,
        y: (head.y + (d === "DOWN" ? 1 : d === "UP" ? -1 : 0) + GRID) % GRID,
      };
      if (snakeRef.current.slice(1).some((s) => s.x === newHead.x && s.y === newHead.y)) {
        setGameState("dead");
        return;
      }
      const ate = newHead.x === foodRef.current.x && newHead.y === foodRef.current.y;
      if (ate) {
        snakeRef.current = [newHead, ...snakeRef.current];
        scoreRef.current += 10;
        foodRef.current = randomFood(snakeRef.current);
        setHighScore((hs) => {
          const nhs = Math.max(hs, scoreRef.current);
          localStorage.setItem("snake-hs", String(nhs));
          return nhs;
        });
      } else {
        snakeRef.current = [newHead, ...snakeRef.current.slice(0, -1)];
      }
      tick((n) => n + 1);
    }, 115);
    return () => clearInterval(interval);
  }, [gameState]);

  const submitScore = async () => {
    const name = nameInput.trim();
    if (!name || submitting || scoreRef.current < 10) return;
    setSubmitting(true);
    try {
      await fetch(`${API}/leaderboard/snake`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, score: scoreRef.current }),
      });
      setSubmitted(true);
      fetchScores();
    } catch {
      /* silent */
    } finally {
      setSubmitting(false);
    }
  };

  const rankColor = (i: number) =>
    i === 0 ? "text-yellow-400" : i === 1 ? "text-gray-400" : i === 2 ? "text-amber-600" : "text-gray-600";

  const formatDate = (s: string) =>
    new Date(s).toLocaleDateString("de-AT", { day: "2-digit", month: "2-digit", year: "2-digit" });

  const snake = snakeRef.current;
  const food = foodRef.current;
  const score = scoreRef.current;
  const size = GRID * CELL;

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
          <div className="flex items-center gap-2">
            <span className="text-base">🐍</span>
            <span className="text-xs font-bold tracking-widest text-gray-300">SNAKE</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setView((v) => (v === "scores" ? "game" : "scores"))}
              title="Leaderboard"
              className={`p-1 rounded transition cursor-pointer ${
                view === "scores" ? "text-yellow-400" : "text-gray-500 hover:text-gray-300"
              }`}
            >
              <Trophy className="w-3.5 h-3.5" />
            </button>
            <button onClick={reset} className="text-gray-500 hover:text-white transition-all duration-300 hover:rotate-180 cursor-pointer">
              <RotateCcw className="w-4 h-4" />
            </button>
            <button onClick={onClose} className="text-gray-500 hover:text-white transition cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {view === "game" ? (
          <>
            {/* Score bar */}
            <div className="flex items-center justify-between px-4 py-2 bg-[#111] border-b border-white/5 font-mono text-sm">
              <span className="text-gray-500">SCORE <span className="text-white">{String(score).padStart(4, "0")}</span></span>
              <span className="text-gray-500">BEST <span className="text-emerald-400">{String(highScore).padStart(4, "0")}</span></span>
            </div>

            {/* Grid */}
            <div className="p-3">
              <div
                className="relative bg-[#080808] border border-white/5 rounded-lg overflow-hidden"
                style={{ width: size, height: size }}
              >
                <div
                  className="absolute rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.7)]"
                  style={{ width: CELL - 6, height: CELL - 6, left: food.x * CELL + 3, top: food.y * CELL + 3 }}
                />
                {snake.map((seg, i) => (
                  <div
                    key={i}
                    className={`absolute rounded-sm ${
                      i === 0 ? "bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.5)]" : "bg-emerald-700"
                    }`}
                    style={{ width: CELL - 2, height: CELL - 2, left: seg.x * CELL + 1, top: seg.y * CELL + 1 }}
                  />
                ))}

                {gameState !== "playing" && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/65 rounded-lg gap-2">
                    {gameState === "idle" ? (
                      <>
                        <p className="text-white font-bold text-lg">🐍 SNAKE</p>
                        <p className="text-gray-400 text-xs">Press ↑ ↓ ← → or WASD to start</p>
                      </>
                    ) : (
                      <>
                        <p className="text-red-400 font-bold text-lg">Game Over</p>
                        <p className="text-gray-400 text-sm">Score: {score}</p>
                        {score >= 10 && !submitted && (
                          <div className="flex items-center gap-2 mt-1">
                            <input
                              value={nameInput}
                              onChange={(e) => setNameInput(e.target.value.slice(0, 20))}
                              onKeyDown={(e) => e.key === "Enter" && submitScore()}
                              placeholder="Your name…"
                              className="w-32 bg-[#1a1a1a] border border-white/10 rounded-lg px-2.5 py-1 text-xs text-white outline-none focus:border-emerald-500/40 placeholder:text-gray-600"
                            />
                            <button
                              onClick={submitScore}
                              disabled={!nameInput.trim() || submitting}
                              className="px-2.5 py-1 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs rounded-lg hover:bg-emerald-500/30 transition disabled:opacity-40 cursor-pointer"
                            >
                              {submitting ? "…" : "Save"}
                            </button>
                          </div>
                        )}
                        {score >= 10 && submitted && (
                          <p className="text-emerald-500 text-xs">Score saved!</p>
                        )}
                        <div className="flex items-center gap-3 mt-1">
                          {submitted && (
                            <button onClick={() => setView("scores")} className="text-xs text-yellow-400 hover:text-yellow-300 flex items-center gap-1 cursor-pointer">
                              <Trophy className="w-3 h-3" /> Leaderboard
                            </button>
                          )}
                          <button onClick={reset} className="px-4 py-1.5 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs rounded-lg hover:bg-emerald-500/30 transition cursor-pointer">
                            Play Again
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>

            {gameState === "playing" && (
              <div className="pb-3 text-center">
                <span className="text-[11px] text-gray-600">arrow keys or WASD · wraps around edges</span>
              </div>
            )}
          </>
        ) : (
          /* Leaderboard view */
          <div style={{ width: size + 24 }}>
            <div className="flex items-center justify-between px-4 py-2.5 bg-[#111] border-b border-white/5">
              <span className="text-xs text-gray-500 font-semibold uppercase tracking-widest">High Scores</span>
              <button onClick={() => setView("game")} className="text-xs text-gray-500 hover:text-gray-300 transition cursor-pointer">← Back</button>
            </div>
            <div className="p-4" style={{ maxHeight: "60vh", overflowY: "auto" }}>
              {scoresLoading ? (
                <div className="space-y-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="h-9 bg-white/4 rounded-lg animate-pulse" />
                  ))}
                </div>
              ) : scores.length === 0 ? (
                <div className="py-10 text-center">
                  <p className="text-gray-600 text-sm">No scores yet.</p>
                  <p className="text-gray-700 text-xs mt-1">Play and be the first!</p>
                </div>
              ) : (
                <div className="space-y-1.5">
                  {scores.map((s, i) => (
                    <div key={s.id} className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-[#111] border border-white/5">
                      <span className={`w-5 text-center text-sm font-bold ${rankColor(i)}`}>{i + 1}</span>
                      <span className="flex-1 text-sm text-white font-medium truncate">{s.name}</span>
                      <span className="font-mono text-sm text-emerald-400">{s.score}</span>
                      <span className="text-[10px] text-gray-600">{formatDate(s.created_at)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
