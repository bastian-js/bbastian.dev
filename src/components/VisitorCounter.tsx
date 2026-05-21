import { useEffect, useRef, useState } from "react";

const API = "https://api.bbastian.dev";

function useCountUp(target: number, duration = 1400) {
  const [value, setValue] = useState(0);
  const raf = useRef<number>(0);

  useEffect(() => {
    if (!target) return;
    const start = performance.now();
    const animate = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) raf.current = requestAnimationFrame(animate);
    };
    raf.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf.current);
  }, [target, duration]);

  return value;
}

export default function VisitorCounter() {
  const [total, setTotal] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const displayed = useCountUp(total);

  useEffect(() => {
    fetch(`${API}/visitors/ping`, { method: "POST", credentials: "include" })
      .then((r) => r.json())
      .then((d) => {
        setTotal(d.count ?? 0);
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, []);

  if (!loaded || total === 0) return null;

  return (
    <div className="w-full bg-[#0a0a0a] px-4 pt-10">
      <div className="max-w-6xl mx-auto">
        <div
          className="flex items-center justify-center gap-3 py-4 rounded-xl"
          style={{ border: "1px solid rgba(255,255,255,0.05)", background: "#0d0d0d" }}
        >
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-50" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          <span className="font-mono text-sm" style={{ color: "rgba(255,255,255,0.25)" }}>
            <span
              className="font-bold tabular-nums transition-all duration-75"
              style={{ color: "rgba(255,255,255,0.7)", fontVariantNumeric: "tabular-nums" }}
            >
              {displayed.toLocaleString("en-US")}
            </span>
            {" "}unique visitors
          </span>
        </div>
      </div>
    </div>
  );
}
