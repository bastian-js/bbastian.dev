import { useState, useEffect, useCallback } from "react";
import { X, Flag, Bomb, Clock, RotateCcw } from "lucide-react";

type Cell = {
  mine: boolean;
  revealed: boolean;
  flagged: boolean;
  adj: number;
};

type GameState = "idle" | "playing" | "won" | "lost";
type Difficulty = "beginner" | "intermediate" | "expert";

const CONFIGS: Record<Difficulty, { rows: number; cols: number; mines: number; cell: number }> = {
  beginner:     { rows: 9,  cols: 9,  mines: 10, cell: 44 },
  intermediate: { rows: 16, cols: 16, mines: 40, cell: 36 },
  expert:       { rows: 16, cols: 30, mines: 99, cell: 28 },
};

const NUM_COLORS = [
  "",
  "text-blue-400",
  "text-emerald-400",
  "text-red-400",
  "text-purple-400",
  "text-red-600",
  "text-cyan-400",
  "text-white",
  "text-gray-400",
];

function makeBoard(rows: number, cols: number): Cell[][] {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => ({
      mine: false, revealed: false, flagged: false, adj: 0,
    }))
  );
}

function generateMines(base: Cell[][], mines: number, sr: number, sc: number): Cell[][] {
  const rows = base.length;
  const cols = base[0].length;
  const board = base.map(r => r.map(c => ({ ...c })));

  let placed = 0;
  while (placed < mines) {
    const r = Math.floor(Math.random() * rows);
    const c = Math.floor(Math.random() * cols);
    if (board[r][c].mine) continue;
    if (Math.abs(r - sr) <= 1 && Math.abs(c - sc) <= 1) continue;
    board[r][c].mine = true;
    placed++;
  }

  for (let r = 0; r < rows; r++) {
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
  }
  return board;
}

function floodReveal(board: Cell[][], row: number, col: number): Cell[][] {
  const rows = board.length;
  const cols = board[0].length;
  const next = board.map(r => r.map(c => ({ ...c })));
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

interface Props {
  onClose: () => void;
}

export default function Minesweeper({ onClose }: Props) {
  const [diff, setDiff] = useState<Difficulty>("beginner");
  const [board, setBoard] = useState<Cell[][]>(() => makeBoard(9, 9));
  const [gameState, setGameState] = useState<GameState>("idle");
  const [flags, setFlags] = useState(10);
  const [time, setTime] = useState(0);

  const cfg = CONFIGS[diff];

  useEffect(() => {
    if (gameState !== "playing") return;
    const t = setInterval(() => setTime(n => n + 1), 1000);
    return () => clearInterval(t);
  }, [gameState]);

  const reset = useCallback((d: Difficulty = diff) => {
    const c = CONFIGS[d];
    setBoard(makeBoard(c.rows, c.cols));
    setGameState("idle");
    setFlags(c.mines);
    setTime(0);
  }, [diff]);

  const switchDiff = (d: Difficulty) => {
    setDiff(d);
    const c = CONFIGS[d];
    setBoard(makeBoard(c.rows, c.cols));
    setGameState("idle");
    setFlags(c.mines);
    setTime(0);
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
      const lost = b.map(row => row.map(cell => ({ ...cell, revealed: cell.mine ? true : cell.revealed })));
      setBoard(lost);
      setGameState("lost");
      return;
    }

    const next = floodReveal(b, r, c);
    setBoard(next);

    if (!next.flat().some(cell => !cell.mine && !cell.revealed)) {
      setGameState("won");
    }
  };

  const handleRightClick = (e: React.MouseEvent, r: number, c: number) => {
    e.preventDefault();
    if (gameState === "idle" || gameState === "won" || gameState === "lost") return;
    if (board[r][c].revealed) return;

    const next = board.map(row => row.map(c => ({ ...c })));
    next[r][c].flagged = !next[r][c].flagged;
    setBoard(next);
    setFlags(f => next[r][c].flagged ? f - 1 : f + 1);
  };

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
            {(["beginner", "intermediate", "expert"] as Difficulty[]).map(d => (
              <button
                key={d}
                onClick={() => switchDiff(d)}
                className={`px-2 py-0.5 rounded text-xs transition capitalize ${
                  diff === d
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    : "text-gray-500 hover:text-gray-300"
                }`}
              >
                {d === "beginner" ? "Easy" : d === "intermediate" ? "Med" : "Hard"}
              </button>
            ))}
            <button onClick={onClose} className="text-gray-500 hover:text-white transition cursor-pointer ml-1">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Stats bar */}
        <div className="flex items-center justify-between px-4 py-2 bg-[#111] border-b border-white/5">
          <div className="flex items-center gap-1.5 font-mono text-sm min-w-[52px]">
            <Flag className="w-3.5 h-3.5 text-red-400 shrink-0" />
            <span className={flags < 0 ? "text-red-400" : "text-white"}>
              {String(Math.abs(Math.min(flags, 999))).padStart(3, "0")}
            </span>
          </div>
          <button
            onClick={() => reset()}
            className="text-gray-400 hover:text-white hover:rotate-180 transition-all duration-300"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-1.5 font-mono text-sm min-w-[52px] justify-end">
            <Clock className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
            <span className="text-white">{String(Math.min(time, 999)).padStart(3, "0")}</span>
          </div>
        </div>

        {/* Board */}
        <div className="p-2 overflow-auto" style={{ maxHeight: "70vh" }}>
          <div
            className="grid gap-0.5"
            style={{ gridTemplateColumns: `repeat(${cfg.cols}, ${cfg.cell}px)` }}
          >
            {board.map((row, r) =>
              row.map((cell, c) => {
                let bg = "bg-[#2a2a2a] hover:bg-[#353535] cursor-pointer active:bg-[#1e1e1e]";
                let text = "";
                let color = "";

                if (cell.flagged) {
                  bg = "bg-[#1e1e1e]";
                  text = "🚩";
                } else if (cell.revealed) {
                  if (cell.mine) {
                    bg = "bg-red-900/40";
                    text = "💣";
                  } else {
                    bg = "bg-[#111]";
                    if (cell.adj > 0) {
                      text = String(cell.adj);
                      color = NUM_COLORS[cell.adj];
                    }
                  }
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
              })
            )}
          </div>
        </div>

        {/* Result */}
        {(gameState === "won" || gameState === "lost") && (
          <div className={`px-4 py-3 text-center text-sm border-t border-white/5 ${
            gameState === "won" ? "bg-emerald-950/30" : "bg-red-950/30"
          }`}>
            <span className={gameState === "won" ? "text-emerald-400 font-bold" : "text-red-400 font-bold"}>
              {gameState === "won" ? `You won in ${time}s 🎉` : "Boom. Game over 💥"}
            </span>
            <button
              onClick={() => reset()}
              className="ml-4 text-xs text-gray-500 hover:text-gray-300 underline transition"
            >
              play again
            </button>
          </div>
        )}

        {/* Hint */}
        {gameState === "idle" && (
          <div className="px-4 py-2 text-center border-t border-white/5">
            <span className="text-xs text-gray-600">right-click to flag · first click is always safe</span>
          </div>
        )}
      </div>
    </div>
  );
}
