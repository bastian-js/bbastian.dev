import { useEffect, useRef } from "react";
import { X } from "lucide-react";

const CHARS =
  "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

interface Props {
  onClose: () => void;
}

export default function MatrixRain({ onClose }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const fontSize = 16;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();

    const cols = Math.floor(canvas.width / fontSize);
    const drops = new Array(cols).fill(1);

    const draw = () => {
      ctx.fillStyle = "rgba(0,0,0,0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < cols; i++) {
        const char = CHARS[Math.floor(Math.random() * CHARS.length)];
        ctx.fillStyle = "#00ff41";
        ctx.fillText(char, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    window.addEventListener("resize", resize);
    const interval = setInterval(draw, 33);

    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[100]">
      <canvas ref={canvasRef} className="absolute inset-0" />
      <button
        className="absolute top-4 right-4 p-2 bg-black/70 border border-green-500/30 rounded-xl text-green-400 hover:bg-black/90 hover:border-green-500/60 transition cursor-pointer z-10"
        onClick={onClose}
      >
        <X className="w-4 h-4" />
      </button>
      <p className="absolute bottom-8 left-1/2 -translate-x-1/2 text-green-500/40 text-xs font-mono tracking-[0.2em] select-none">
        PRESS ESC OR CLICK × TO EXIT THE MATRIX
      </p>
    </div>
  );
}
