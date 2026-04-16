import { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";

const LINES = [
  "> initializing secure connection...",
  "> bypassing firewall [████████████] 100%",
  "> decrypting personnel database...",
  "",
  "  ╔══════════════════════════════════╗",
  "  ║    CLASSIFIED  //  EYES ONLY    ║",
  "  ╚══════════════════════════════════╝",
  "",
  "  NAME ................. Bastian",
  "  AGE .................. 20",
  "  LOCATION ............. Austria",
  "  CURRENT PROJECT ...... Noury",
  "  COFFEE STATUS ........ critical dependency",
  "  FAVORITE LANG ........ TypeScript",
  "  EASTER EGGS FOUND .... 2 of 2",
  "  VERDICT .............. suspicious genius",
  "",
  "> ACCESS GRANTED",
  "",
  "  nice one. not many make it this far.",
];

interface Props {
  onClose: () => void;
}

export default function HackerTerminal({ onClose }: Props) {
  const [displayed, setDisplayed] = useState<string[]>([""]);
  const [done, setDone] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const tidRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let li = 0;
    let ci = 0;

    const tick = () => {
      if (li >= LINES.length) {
        setDone(true);
        return;
      }

      const line = LINES[li];

      if (ci < line.length) {
        setDisplayed(prev => {
          const next = [...prev];
          next[li] = line.slice(0, ci + 1);
          return next;
        });
        ci++;
        tidRef.current = setTimeout(tick, line.startsWith(">") ? 28 : 11);
      } else {
        ci = 0;
        li++;
        if (li < LINES.length) setDisplayed(prev => [...prev, ""]);
        const pause = line === "" ? 35 : line.startsWith(">") ? 130 : 45;
        tidRef.current = setTimeout(tick, pause);
      }
    };

    tick();
    return () => { if (tidRef.current) clearTimeout(tidRef.current); };
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [displayed]);

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <style>{`
        @keyframes scanline {
          0%   { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
        @keyframes blink { 0%,100% { opacity: 1; } 50% { opacity: 0; } }
        .crt::after {
          content: "";
          position: absolute;
          inset: 0;
          height: 2px;
          width: 100%;
          background: rgba(0,255,80,0.05);
          animation: scanline 5s linear infinite;
          pointer-events: none;
        }
        .cursor { animation: blink 1s step-start infinite; }
      `}</style>

      <div className="crt relative bg-black border border-green-500/30 rounded-xl shadow-[0_0_60px_rgba(0,255,80,0.12)] w-full max-w-xl overflow-hidden">

        {/* Title bar */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-green-500/20">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
            <span className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
          </div>
          <span className="text-green-500/50 text-xs font-mono">classified_access.sh</span>
          <button onClick={onClose} className="text-green-500/40 hover:text-green-400 transition cursor-pointer">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Terminal */}
        <div className="p-5 font-mono text-sm text-green-400 max-h-[60vh] overflow-y-auto leading-relaxed space-y-0">
          {displayed.map((line, i) => (
            <div
              key={i}
              className={
                line.startsWith("> ACCESS")
                  ? "text-green-300 font-bold"
                  : line.includes("╗") || line.includes("╚") || line.includes("╔")
                  ? "text-green-300"
                  : line.startsWith(">")
                  ? "text-green-500"
                  : "text-green-400"
              }
            >
              {line || "\u00A0"}
              {i === displayed.length - 1 && !done && (
                <span className="cursor">█</span>
              )}
            </div>
          ))}

          {done && (
            <div className="mt-4 text-green-600 text-xs">press esc to close_</div>
          )}

          <div ref={bottomRef} />
        </div>
      </div>
    </div>
  );
}
