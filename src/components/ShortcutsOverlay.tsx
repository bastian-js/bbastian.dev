import { X, Keyboard } from "lucide-react";

type Section = { type: "section"; label: string };
type Shortcut = { type: "shortcut"; key: string; action: string };

const ITEMS: Array<Section | Shortcut> = [
  { type: "section", label: "Navigate" },
  { type: "shortcut", key: "H", action: "Home" },
  { type: "shortcut", key: "P", action: "Projects" },
  { type: "shortcut", key: "S", action: "Socials" },
  { type: "shortcut", key: "A", action: "About" },
  { type: "shortcut", key: "C", action: "Contact" },
  { type: "shortcut", key: "G", action: "Open GitHub" },
  { type: "section", label: "Easter Eggs" },
  { type: "shortcut", key: "m i n e", action: "Launch Minesweeper" },
  { type: "section", label: "Other" },
  { type: "shortcut", key: "?", action: "Toggle this overlay" },
  { type: "shortcut", key: "Esc", action: "Close any overlay" },
];

interface Props {
  onClose: () => void;
}

export default function ShortcutsOverlay({ onClose }: Props) {
  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
          <div className="flex items-center gap-2">
            <Keyboard className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-semibold">Keyboard Shortcuts</span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-white transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-5 py-4 space-y-0.5">
          {ITEMS.map((item, i) =>
            item.type === "section" ? (
              <p
                key={i}
                className="text-[10px] text-gray-600 uppercase tracking-widest pt-4 pb-1.5 first:pt-0"
              >
                {item.label}
              </p>
            ) : (
              <div key={i} className="flex items-center justify-between py-1.5">
                <kbd className="text-xs bg-[#1a1a1a] border border-white/10 text-gray-300 px-2 py-0.5 rounded font-mono whitespace-nowrap">
                  {item.key}
                </kbd>
                <span className="text-sm text-gray-400 ml-4">
                  {item.action}
                </span>
              </div>
            ),
          )}
        </div>

        <div className="px-5 pb-4 text-center">
          <span className="text-xs text-gray-700">
            press{" "}
            <kbd className="bg-[#1a1a1a] border border-white/10 text-gray-500 px-1.5 py-0.5 rounded font-mono text-xs">
              ?
            </kbd>{" "}
            to toggle
          </span>
        </div>
      </div>
    </div>
  );
}
