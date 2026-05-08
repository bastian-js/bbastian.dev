import { useState, useEffect, useCallback } from "react";
import { X, Flag, Bomb, Clock, RotateCcw, Trophy } from "lucide-react";

type Cell = { mine: boolean; revealed: boolean; flagged: boolean; adj: number };
type GameState = "idle" | "playing" | "won" | "lost";
type Difficulty = "beginner" | "intermediate" | "expert";
type View = "game" | "scores";

const CONFIGS: Record<Difficulty, { rows: number; cols: number; mines: number; cell: number }> = {
  beginner:     { rows: 9,  cols: 9,  mines: 10, cell: 44 },
  intermediate: { rows: 16, cols: 16, mines: 40, cell: 36 },
  expert:       { rows: 16, cols: 30, mines: 99, cell: 28 },
};

const NUM_COLORS = [
  "", "text-blue-400", "text-emerald-400", "text-red-400",
  "text-purple-400", "text-red-600", "text-cyan-400", "text-white", "text-gray-400",
];

const API = "https://api.bbastian.dev";

interface Score { id: number; name: string; time_secs: number; difficulty: string; created_at: string }

function makeBoard(rows: number, cols: number): Cell[][] {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => ({ mine: false, revealed: false, flagged: false, adj: 0 })),
  );
}

function generateMines(base: Cell[][], mines: number, sr: number, sc: number): Cell[][] {
  const rows = base.length, cols = base[0].length;
  const board = base.map((r) => r.map((c) => ({ ...c })));
  let placed = 0;
  while (placed < mines) {
    const r = Math.floor(Math.random() * rows);
    const c = Math.floor(Math.random() * cols);
    if (board[r][c].mine) continue;
    if (Math.abs(r - sr) <= 1 && Math.abs(c - sc) <= 1) continue;
    board[r][c].mine = true;
    placed++;
  }
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++) {
      if (board[r][c].mine) continue;
      let n = 0;
      for (let dr = -1; dr <= 1; dr++)
        for (let dc = -1; dc <= 1; dc++) {
          const nr = r + dr, nc = c + dc;
          if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && board[nr][nc].mine) n++;
        }
      board[r][c].adj = n;
    }
  return board;
}

function floodReveal(board: Cell[][], row: number, col: number): Cell[][] {
  const rows = board.length, cols = board[0].length;
  const next = board.map((r) => r.map((c) => ({ ...c })));
  const stack = [[row, col]];
  while (stack.length) {
    const [r, c] = stack.pop()!;
    if (r < 0 || r >= rows || c < 0 || c >= cols) continue;
    const cell = next[r][c];
    if (cell.revealed || cell.flagged || cell.mine) continue;
    cell.revealed = true;
    if (cell.adj === 0)
      for (let dr = -1; dr <= 1; dr++)
        for (let dc = -1; dc <= 1; dc++)
          if (dr !== 0 || dc !== 0) stack.push([r + dr, c + dc]);
  }
  return next;
}

interface Props { onClose: () => void }

export default function Minesweeper({ onClose }: Props) {
  const [diff, setDiff] = useState<Difficulty>("beginner");
  const [board, setBoard] = useState<Cell[][]>(() => makeBoard(9, 9));
  const [gameState, setGameState] = useState<GameState>("idle");
  const [flags, setFlags] = useState(10);
  const [time, setTime] = useState(0);
  const [view, setView] = useState<View>("game");

  // leaderboard state
  const [scores, setScores] = useState<Score[]>([]);
  const [scoresLoading, setScoresLoading] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const cfg = CONFIGS[diff];

  useEffect(() => {
    if (gameState !== "playing") return;
    const t = setInterval(() => setTime((n) => n + 1), 1000);
    return () => clearInterval(t);
  }, [gameState]);

  const fetchScores = useCallback(async (d: Difficulty) => {
    setScoresLoading(true);
    try {
      const res = await fetch(`${API}/leaderboard/minesweeper?difficulty=${d}`);
      const data = await res.json();
      setScores(data.scores ?? []);
    } catch {
      setScores([]);
    } finally {
      setScoresLoading(false);
    }
  }, []);

  useEffect(() => {
    if (view === "scores") fetchScores(diff);
  }, [view, diff, fetchScores]);

  const reset = useCallback((d: Difficulty = diff) => {
    const c = CONFIGS[d];
    setBoard(makeBoard(c.rows, c.cols));
    setGameState("idle");
    setFlags(c.mines);
    setTime(0);
    setSubmitted(false);
    setNameInput("");
  }, [diff]);

  const switchDiff = (d: Difficulty) => {
    setDiff(d);
    const c = CONFIGS[d];
    setBoard(makeBoard(c.rows, c.cols));
    setGameState("idle");
    setFlags(c.mines);
    setTime(0);
    setSubmitted(false);
    setNameInput("");
  };

  const handleClick = (r: number, c: number) => {
    if (gameState === "won" || gameState === "lost") return;
    const cell = board[r][c];
    if (cell.revealed || cell.flagged) return;
    let b = board;
    if (gameState === "idle") {
      b = generateMines(makeBoard(cfg.rows, cfg.cols), cfg.mines, r, c);
      setGameState("playing");
    }
    if (b[r][c].mine) {
      const lost = b.map((row) => row.map((cell) => ({ ...cell, revealed: cell.mine ? true : cell.revealed })));
      setBoard(lost);
      setGameState("lost");
      return;
    }
    const next = floodReveal(b, r, c);
    setBoard(next);
    if (!next.flat().some((cell) => !cell.mine && !cell.revealed)) setGameState("won");
  };

  const handleRightClick = (e: React.MouseEvent, r: number, c: number) => {
    e.preventDefault();
    if (gameState === "idle" || gameState === "won" || gameState === "lost") return;
    if (board[r][c].revealed) return;
    const next = board.map((row) => row.map((c) => ({ ...c })));
    next[r][c].flagged = !next[r][c].flagged;
    setBoard(next);
    setFlags((f) => (next[r][c].flagged ? f - 1 : f + 1));
  };

  const submitScore = async () => {
    const name = nameInput.trim();
    if (!name || submitting) return;
    setSubmitting(true);
    try {
      await fetch(`${API}/leaderboard/minesweeper`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, time_secs: time, difficulty: diff }),
      });
      setSubmitted(true);
      fetchScores(diff);
    } catch {
      /* silent */
    } finally {
      setSubmitting(false);
    }
  };

  const rankColor = (i: number) =>
    i === 0 ? "text-yellow-400" : i === 1 ? "text-gray-400" : i === 2 ? "text-amber-600" : "text-gray-600";

  const formatDate = (s: string) => new Date(s).toLocaleDateString("de-AT", { day: "2-digit", month: "2-digit", year: "2-digit" });

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden max-w-[95vw]">

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
          <div className="flex items-center gap-2">
            <Bomb className="w-3.5 h-3.5 text-red-400" />
            <span className="text-xs font-bold tracking-widest text-gray-300">MINESWEEPER</span>
          </div>
          <div className="flex items-center gap-1.5">
            {(["beginner", "intermediate", "expert"] as Difficulty[]).map((d) => (
              <button
                key={d}
                onClick={() => switchDiff(d)}
                className={`px-2 py-0.5 rounded text-xs transition capitalize cursor-pointer ${
                  diff === d
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    : "text-gray-500 hover:text-gray-300"
                }`}
              >
                {d === "beginner" ? "Easy" : d === "intermediate" ? "Med" : "Hard"}
              </button>
            ))}
            <div className="w-px h-3.5 bg-white/10 mx-0.5" />
            <button
              onClick={() => setView((v) => (v === "scores" ? "game" : "scores"))}
              title="Leaderboard"
              className={`p-1 rounded transition cursor-pointer ${
                view === "scores" ? "text-yellow-400" : "text-gray-500 hover:text-gray-300"
              }`}
            >
              <Trophy className="w-3.5 h-3.5" />
            </button>
            <button onClick={onClose} className="text-gray-500 hover:text-white transition cursor-pointer ml-0.5">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {view === "game" ? (
          <>
            {/* Stats bar */}
            <div className="flex items-center justify-between px-4 py-2 bg-[#111] border-b border-white/5">
              <div className="flex items-center gap-1.5 font-mono text-sm min-w-[52px]">
                <Flag className="w-3.5 h-3.5 text-red-400 shrink-0" />
                <span className={flags < 0 ? "text-red-400" : "text-white"}>
                  {String(Math.abs(Math.min(flags, 999))).padStart(3, "0")}
                </span>
              </div>
              <button onClick={() => reset()} className="text-gray-400 hover:text-white hover:rotate-180 transition-all duration-300 cursor-pointer">
                <RotateCcw className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-1.5 font-mono text-sm min-w-[52px] justify-end">
                <Clock className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
                <span className="text-white">{String(Math.min(time, 999)).padStart(3, "0")}</span>
              </div>
            </div>

            {/* Board */}
            <div className="p-2 overflow-auto" style={{ maxHeight: "70vh" }}>
              <div className="grid gap-0.5" style={{ gridTemplateColumns: `repeat(${cfg.cols}, ${cfg.cell}px)` }}>
                {board.map((row, r) =>
                  row.map((cell, c) => {
                    let bg = "bg-[#2a2a2a] hover:bg-[#353535] cursor-pointer active:bg-[#1e1e1e]";
                    let text = "";
                    let color = "";
                    if (cell.flagged) { bg = "bg-[#1e1e1e]"; text = "🚩"; }
                    else if (cell.revealed) {
                      if (cell.mine) { bg = "bg-red-900/40"; text = "💣"; }
                      else { bg = "bg-[#111]"; if (cell.adj > 0) { text = String(cell.adj); color = NUM_COLORS[cell.adj]; } }
                    }
                    return (
                      <button
                        key={`${r}-${c}`}
                        onClick={() => handleClick(r, c)}
                        onContextMenu={(e) => handleRightClick(e, r, c)}
                        style={{ width: cfg.cell, height: cfg.cell }}
                        className={`flex items-center justify-center text-xs font-bold rounded-[3px] select-none transition-colors ${bg} ${color}`}
                      >
                        {text}
                      </button>
                    );
                  }),
                )}
              </div>
            </div>

            {/* Result */}
            {gameState === "won" && (
              <div className="border-t border-white/5 bg-emerald-950/30">
                {!submitted ? (
                  <div className="flex items-center gap-3 px-4 py-3 flex-wrap">
                    <span className="text-emerald-400 font-bold text-sm shrink-0">Won in {time}s 🎉</span>
                    <input
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value.slice(0, 20))}
                      onKeyDown={(e) => e.key === "Enter" && submitScore()}
                      placeholder="Your name…"
                      className="flex-1 min-w-[100px] bg-[#1a1a1a] border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white outline-none focus:border-emerald-500/40 placeholder:text-gray-600"
                    />
                    <button
                      onClick={submitScore}
                      disabled={!nameInput.trim() || submitting}
                      className="px-3 py-1.5 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs rounded-lg hover:bg-emerald-500/30 transition disabled:opacity-40 cursor-pointer shrink-0"
                    >
                      {submitting ? "…" : "Save score"}
                    </button>
                    <button onClick={() => reset()} className="text-xs text-gray-600 hover:text-gray-400 underline shrink-0">skip</button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between px-4 py-3">
                    <span className="text-emerald-400 font-bold text-sm">Won in {time}s 🎉 — saved!</span>
                    <div className="flex items-center gap-3">
                      <button onClick={() => setView("scores")} className="text-xs text-yellow-400 hover:text-yellow-300 transition cursor-pointer flex items-center gap-1"><Trophy className="w-3 h-3" /> View scores</button>
                      <button onClick={() => reset()} className="text-xs text-gray-500 hover:text-gray-300 underline cursor-pointer">play again</button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {gameState === "lost" && (
              <div className="px-4 py-3 text-center text-sm border-t border-white/5 bg-red-950/30">
                <span className="text-red-400 font-bold">Boom. Game over 💥</span>
                <button onClick={() => reset()} className="ml-4 text-xs text-gray-500 hover:text-gray-300 underline cursor-pointer">play again</button>
              </div>
            )}

            {gameState === "idle" && (
              <div className="px-4 py-2 text-center border-t border-white/5">
                <span className="text-xs text-gray-600">right-click to flag · first click is always safe</span>
              </div>
            )}
          </>
        ) : (
          /* Leaderboard view */
          <div style={{ minWidth: cfg.cols * cfg.cell + 16 }}>
            <div className="flex items-center justify-between px-4 py-2.5 bg-[#111] border-b border-white/5">
              <span className="text-xs text-gray-500 font-semibold uppercase tracking-widest">Top Times</span>
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
                  <p className="text-gray-700 text-xs mt-1">Win a game and be the first!</p>
                </div>
              ) : (
                <div className="space-y-1.5">
                  {scores.map((s, i) => (
                    <div key={s.id} className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-[#111] border border-white/5">
                      <span className={`w-5 text-center text-sm font-bold ${rankColor(i)}`}>{i + 1}</span>
                      <span className="flex-1 text-sm text-white font-medium truncate">{s.name}</span>
                      <span className="font-mono text-sm text-emerald-400">{s.time_secs}s</span>
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
