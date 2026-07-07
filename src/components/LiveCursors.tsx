import { useEffect, useRef } from "react";

/* ─────────────────────────────────────────────────────────────────────
 *  CONFIG
 * ─────────────────────────────────────────────────────────────────────
 *  TEST = true   → simulierte Fake-Cursor, KEIN Server nötig
 *  TEST = false  → echte Live-Cursor anderer Besucher via WebSocket
 *  TEST_CURSOR_COUNT → wie viele Fake-Cursor rumschweben (0–1000)
 */
const TEST = true;
const TEST_CURSOR_COUNT = 5;
/* ───────────────────────────────────────────────────────────────────── */

// Live-Endpoint (nur relevant wenn TEST = false). Server-Teil kommt separat.
const WS_URL = "wss://api.bbastian.dev/cursors";

const MAX_CURSORS = 1000; // harte Obergrenze

const COLORS = [
  "#34d399",
  "#60a5fa",
  "#f472b6",
  "#a78bfa",
  "#fb923c",
  "#facc15",
  "#38bdf8",
  "#4ade80",
  "#f87171",
  "#c084fc",
];

interface Cursor {
  x: number; // aktuelle Position (px)
  y: number;
  tx: number; // Zielposition (px) — es wird sanft dorthin interpoliert
  ty: number;
  color: string;
  speed: number; // Interpolations-Faktor pro Frame (Test-Modus)
}

interface Ripple {
  x: number;
  y: number;
  color: string;
  start: number; // performance.now()
}

const rand = (min: number, max: number) => min + Math.random() * (max - min);
const pick = <T,>(arr: T[]) => arr[(Math.random() * arr.length) | 0];

/**
 * Live-Multiplayer-Cursor (Figma-Style). Rendert alle Cursor auf einem
 * bildschirmfüllenden, klick-durchlässigen Canvas.
 *
 * Test-Modus: simuliert N sanft umherwandernde Cursor — ideal zum Entwickeln
 * ohne echte Besucher. Live-Modus: verbindet sich per WebSocket.
 */
export default function LiveCursors() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const count = Math.max(0, Math.min(MAX_CURSORS, TEST_CURSOR_COUNT | 0));
    if (TEST && count === 0) return; // nichts anzuzeigen

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas!.width = window.innerWidth * dpr;
      canvas!.height = window.innerHeight * dpr;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener("resize", resize);

    const cursors = new Map<string, Cursor>();
    const ripples: Ripple[] = [];

    // ── Datenquelle: Test-Simulation oder Live-WebSocket ──────────────
    let ws: WebSocket | null = null;
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
    let broadcastLast = 0;

    function seedTestCursors() {
      const w = window.innerWidth;
      const h = window.innerHeight;
      for (let i = 0; i < count; i++) {
        cursors.set(String(i), {
          x: rand(0, w),
          y: rand(0, h),
          tx: rand(0, w),
          ty: rand(0, h),
          color: pick(COLORS),
          speed: rand(0.012, 0.032),
        });
      }
    }

    function connectLive() {
      try {
        ws = new WebSocket(WS_URL);
      } catch {
        return;
      }

      ws.onmessage = (ev) => {
        let msg: unknown;
        try {
          msg = JSON.parse(ev.data as string);
        } catch {
          return;
        }
        const data = msg as {
          type?: string;
          id?: string;
          cursors?: {
            id: string;
            x: number;
            y: number;
            color?: string;
          }[];
        };
        const w = window.innerWidth;
        const h = window.innerHeight;

        if (data.type === "leave" && data.id) {
          cursors.delete(data.id);
          return;
        }
        // Vollständiger State: { type: "state", cursors: [{id,x,y,color}] }
        // Koordinaten kommen normalisiert (0–1) und werden auf px gemappt.
        if (data.cursors) {
          const alive = new Set<string>();
          for (const c of data.cursors) {
            alive.add(c.id);
            const existing = cursors.get(c.id);
            const tx = c.x * w;
            const ty = c.y * h;
            if (existing) {
              existing.tx = tx;
              existing.ty = ty;
            } else {
              cursors.set(c.id, {
                x: tx,
                y: ty,
                tx,
                ty,
                color: c.color || pick(COLORS),
                speed: 0.25,
              });
            }
          }
          // Verschwundene Cursor entfernen
          for (const id of cursors.keys())
            if (!alive.has(id)) cursors.delete(id);
        }
      };

      ws.onclose = () => {
        ws = null;
        // einfacher Reconnect
        reconnectTimer = setTimeout(connectLive, 2000);
      };
      ws.onerror = () => ws?.close();
    }

    function onMove(e: MouseEvent) {
      const now = performance.now();
      if (now - broadcastLast < 40) return; // ~25 Updates/s
      broadcastLast = now;
      if (ws && ws.readyState === WebSocket.OPEN)
        ws.send(
          JSON.stringify({
            x: e.clientX / window.innerWidth,
            y: e.clientY / window.innerHeight,
          }),
        );
    }

    if (TEST) {
      seedTestCursors();
    } else {
      connectLive();
      window.addEventListener("mousemove", onMove);
    }

    // ── Zeichnen ──────────────────────────────────────────────────────
    function drawCursor(c: Cursor) {
      ctx!.save();
      ctx!.translate(c.x, c.y);

      // Pfeil (klassischer Zeiger), Spitze bei 0,0
      ctx!.beginPath();
      ctx!.moveTo(0, 0);
      ctx!.lineTo(0, 17);
      ctx!.lineTo(4.6, 12.8);
      ctx!.lineTo(7.2, 18.6);
      ctx!.lineTo(9.6, 17.5);
      ctx!.lineTo(7, 11.9);
      ctx!.lineTo(12.2, 11.9);
      ctx!.closePath();
      ctx!.lineJoin = "round";
      ctx!.lineWidth = 1.5;
      ctx!.strokeStyle = "rgba(0,0,0,0.35)";
      ctx!.stroke();
      ctx!.fillStyle = c.color;
      ctx!.fill();

      ctx!.restore();
    }

    // ── Render-Loop ────────────────────────────────────────────────────
    let raf = 0;
    function frame() {
      const now = performance.now();
      ctx!.clearRect(0, 0, window.innerWidth, window.innerHeight);

      const w = window.innerWidth;
      const h = window.innerHeight;

      for (const c of cursors.values()) {
        // Position sanft Richtung Ziel interpolieren
        c.x += (c.tx - c.x) * c.speed;
        c.y += (c.ty - c.y) * c.speed;

        if (TEST) {
          // Neues Ziel wählen, sobald das alte fast erreicht ist
          const dx = c.tx - c.x;
          const dy = c.ty - c.y;
          if (dx * dx + dy * dy < 9) {
            c.tx = rand(0, w);
            c.ty = rand(0, h);
          }
          // Gelegentlicher "Klick"
          if (Math.random() < 0.0006 && ripples.length < 40)
            ripples.push({ x: c.x, y: c.y, color: c.color, start: now });
        }

        drawCursor(c);
      }

      // Klick-Ripples
      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        const t = (now - r.start) / 500; // 0 → 1 über 500ms
        if (t >= 1) {
          ripples.splice(i, 1);
          continue;
        }
        ctx!.beginPath();
        ctx!.arc(r.x, r.y, 4 + t * 22, 0, Math.PI * 2);
        ctx!.strokeStyle = r.color;
        ctx!.globalAlpha = 1 - t;
        ctx!.lineWidth = 2;
        ctx!.stroke();
        ctx!.globalAlpha = 1;
      }

      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);

    // ── Cleanup ────────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      if (reconnectTimer) clearTimeout(reconnectTimer);
      if (ws) {
        ws.onclose = null;
        ws.close();
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 9998,
      }}
    />
  );
}
