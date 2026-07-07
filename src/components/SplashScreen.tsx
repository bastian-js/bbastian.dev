import { useEffect, useState } from "react";

const SESSION_KEY = "bbastian_splash_shown";

// Module-level guard prevents StrictMode's double-invocation from re-initializing
let _started = false;

type Phase = "idle" | "in" | "splitting" | "done";

const SITE_NAME = "bbastian.dev";

const KEYFRAMES = `
  @keyframes _splashLogoIn {
    from { opacity: 0; transform: scale(0.82) translateY(6px); }
    to   { opacity: 1; transform: scale(1)    translateY(0);   }
  }
  @keyframes _splashCharUp {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0);    }
  }
  @keyframes _splashLineExpand {
    from { transform: scaleX(0); opacity: 0; }
    to   { transform: scaleX(1); opacity: 1; }
  }
  @keyframes _splashSeamPulse {
    0%   { opacity: 0; }
    20%  { opacity: 1; }
    100% { opacity: 0; }
  }
`;

export default function SplashScreen() {
  const [phase, setPhase] = useState<Phase>(() =>
    sessionStorage.getItem(SESSION_KEY) ? "done" : "idle"
  );

  useEffect(() => {
    if (_started || phase === "done") return;
    _started = true;
    sessionStorage.setItem(SESSION_KEY, "1");

    // Intentionally no cleanup — timers must survive StrictMode unmount/remount.
    // React 18 safely ignores setState calls on unmounted components.
    setTimeout(() => setPhase("in"), 40);
    setTimeout(() => setPhase("splitting"), 780);
    setTimeout(() => setPhase("done"), 1380);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (phase === "done") return null;

  const splitting = phase === "splitting";
  const animating = phase === "in" || splitting;

  // Content rendered identically inside both panels.
  // Left panel: positioned left:0 width:100vw → left half is visible.
  // Right panel: positioned left:-50vw width:100vw → right half is visible.
  // Both move with their panel, creating the split-text illusion.
  const content = (
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: 0,
        width: "100vw",
        transform: "translateY(-50%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "18px",
        pointerEvents: "none",
        userSelect: "none",
      }}
    >
      {/* Code-bracket logo mark */}
      <div
        style={{
          fontFamily: "'Courier New', Courier, monospace",
          fontSize: "clamp(18px, 2.5vw, 26px)",
          lineHeight: 1,
          letterSpacing: "0.04em",
          opacity: animating ? undefined : 0,
          animation: animating
            ? "_splashLogoIn 0.55s cubic-bezier(0.34,1.56,0.64,1) 0.05s both"
            : "none",
        }}
      >
        <span style={{ color: "#34d399" }}>&lt;</span>
        <span style={{ color: "#ffffff", fontWeight: 700 }}>B</span>
        <span style={{ color: "#34d399" }}>/&gt;</span>
      </div>

      {/* Site name — each character animates up independently */}
      <div
        style={{
          display: "flex",
          fontFamily: "Inter, -apple-system, BlinkMacSystemFont, sans-serif",
          fontSize: "clamp(32px, 6vw, 68px)",
          fontWeight: 600,
          letterSpacing: "-0.04em",
          color: "#ffffff",
          lineHeight: 1,
        }}
      >
        {SITE_NAME.split("").map((char, i) => (
          <span
            key={i}
            style={{
              display: "inline-block",
              whiteSpace: "pre",
              opacity: animating ? undefined : 0,
              animation: animating
                ? `_splashCharUp 0.4s cubic-bezier(0.22,1,0.36,1) ${0.14 + i * 0.022}s both`
                : "none",
            }}
          >
            {char}
          </span>
        ))}
      </div>

      {/* Emerald accent line */}
      <div
        style={{
          width: "32px",
          height: "2px",
          borderRadius: "999px",
          background: "#34d399",
          transformOrigin: "center center",
          opacity: animating ? undefined : 0,
          animation: animating
            ? "_splashLineExpand 0.36s cubic-bezier(0.22,1,0.36,1) 0.48s both"
            : "none",
        }}
      />
    </div>
  );

  const panelStyle = (side: "left" | "right"): React.CSSProperties => ({
    position: "absolute",
    top: 0,
    left: side === "left" ? 0 : "50vw",
    width: "50vw",
    height: "100vh",
    overflow: "hidden",
    background: "#0a0a0a",
    // Dot grid texture
    backgroundImage:
      "radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)",
    backgroundSize: "28px 28px",
    willChange: "transform",
    transform: splitting
      ? `translateX(${side === "left" ? "-100%" : "100%"})`
      : "translateX(0)",
    transition: splitting
      ? "transform 0.6s cubic-bezier(0.87,0,0.13,1)"
      : "none",
  });

  // Inner-edge gradient gives each panel a subtle lit edge facing the seam
  const edgeGlow = (side: "left" | "right"): React.CSSProperties => ({
    position: "absolute",
    top: 0,
    [side === "left" ? "right" : "left"]: 0,
    width: "80px",
    height: "100%",
    background: `linear-gradient(to ${side === "left" ? "left" : "right"}, rgba(255,255,255,0.025), transparent)`,
    pointerEvents: "none",
  });

  return (
    <>
      <style>{KEYFRAMES}</style>

      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9999,
          pointerEvents: splitting ? "none" : "auto",
        }}
      >
        {/* Left panel */}
        <div style={panelStyle("left")}>
          <div style={edgeGlow("left")} />
          {content}
        </div>

        {/* Right panel — content shifted left by 50vw to align with screen center */}
        <div style={panelStyle("right")}>
          <div style={edgeGlow("right")} />
          <div
            style={{
              position: "absolute",
              inset: 0,
              left: "-50vw",
              width: "100vw",
            }}
          >
            {content}
          </div>
        </div>

        {/* Seam glow — vertical emerald flash at the split moment */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "calc(50% - 1px)",
            width: "2px",
            height: "100vh",
            background:
              "linear-gradient(to bottom, transparent 0%, #34d399 30%, #34d399 70%, transparent 100%)",
            pointerEvents: "none",
            animation: splitting
              ? "_splashSeamPulse 0.7s ease-out forwards"
              : "none",
            opacity: 0,
          }}
        />
      </div>
    </>
  );
}
