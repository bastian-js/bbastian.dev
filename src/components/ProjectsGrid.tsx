import React, { useEffect, useRef, useState, useCallback } from "react";
import { ArrowUpRight, Github, X, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import MagneticWrapper from "./MagneticWrapper";

export interface Project {
  title: string;
  description: string;
  technologies: string[];
  image?: string;
  images?: string[];
  githubUrl?: string;
  liveUrl?: string;
  color?: string;
  showGithub?: boolean;
  showLiveDemo?: boolean;
  longDescription?: string;
  badge?: string;
  badgeColor?: string;
  liveDemoLabel?: string;
  featured?: boolean;
}

// ─── Detail Overlay ────────────────────────────────────────────────────────────

const DetailOverlay: React.FC<{
  project: Project;
  index: number;
  onClose: () => void;
}> = ({ project, index, onClose }) => {
  const {
    title,
    description,
    longDescription,
    technologies,
    images,
    githubUrl,
    liveUrl,
    color = "#34d399",
    showGithub = true,
    showLiveDemo = true,
    badge,
    liveDemoLabel = "Live Demo",
  } = project;

  const [imgIndex, setImgIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    requestAnimationFrame(() => setMounted(true));
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const num = String(index + 1).padStart(2, "0");

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-200 flex items-end sm:items-center justify-center"
      style={{ perspective: "1200px" }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 cursor-pointer"
        style={{
          background: "rgba(0,0,0,0.85)",
          backdropFilter: "blur(24px)",
          opacity: mounted ? 1 : 0,
          transition: "opacity 0.35s ease",
        }}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className="relative w-full sm:w-auto sm:max-w-3xl mx-auto overflow-hidden"
        style={{
          background: "#0e0e0e",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "24px 24px 0 0",
          maxHeight: "92dvh",
          overflowY: "auto",
          transform: mounted ? "translateY(0) scale(1)" : "translateY(60px) scale(0.97)",
          opacity: mounted ? 1 : 0,
          transition: "transform 0.42s cubic-bezier(0.22,1,0.36,1), opacity 0.35s ease",
          boxShadow: `0 -2px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.04), 0 -1px 0 0 ${color}`,
        }}
      >
        {/* Top color seam */}
        <div
          style={{
            height: "2px",
            background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
            boxShadow: `0 0 24px 4px ${color}60`,
          }}
        />

        {/* Ghost number */}
        <div
          className="absolute top-4 right-8 font-black pointer-events-none select-none leading-none"
          style={{
            fontSize: "clamp(80px, 15vw, 140px)",
            color,
            opacity: 0.04,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {num}
        </div>

        <div className="relative p-6 sm:p-8">
          {/* Header row */}
          <div className="flex items-start justify-between gap-4 mb-6">
            <div className="flex flex-col gap-2">
              <span
                className="text-[10px] font-black tracking-[0.2em] uppercase"
                style={{ color, opacity: 0.7 }}
              >
                {num}
              </span>
              {badge && (
                <span
                  className="self-start text-[10px] font-bold px-2 py-0.5 rounded-md tracking-widest uppercase"
                  style={{ color, background: color + "18" }}
                >
                  {badge}
                </span>
              )}
              <h2
                className="text-3xl sm:text-4xl font-black tracking-tight text-white leading-[1.05]"
              >
                {title}
              </h2>
            </div>
            <MagneticWrapper strength={0.5}>
              <button
                onClick={onClose}
                className="shrink-0 w-9 h-9 flex items-center justify-center rounded-full cursor-pointer"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "rgba(255,255,255,0.5)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.color = "white";
                  (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.1)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.5)";
                  (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.06)";
                }}
              >
                <X className="w-4 h-4" />
              </button>
            </MagneticWrapper>
          </div>

          {/* Image carousel */}
          {images && images.length > 0 && (
            <div
              className="relative w-full overflow-hidden mb-6"
              style={{
                height: "220px",
                borderRadius: "14px",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              <img
                src={images[imgIndex]}
                alt={`${title} ${imgIndex + 1}`}
                className="w-full h-full object-cover"
                style={{ transition: "opacity 0.3s ease" }}
              />
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setImgIndex((p) => (p - 1 + images.length) % images.length)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full cursor-pointer"
                    style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)" }}
                  >
                    <ChevronLeft className="w-4 h-4 text-white" />
                  </button>
                  <button
                    onClick={() => setImgIndex((p) => (p + 1) % images.length)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full cursor-pointer"
                    style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)" }}
                  >
                    <ChevronRight className="w-4 h-4 text-white" />
                  </button>
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {images.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setImgIndex(i)}
                        className="rounded-full transition-all cursor-pointer"
                        style={{
                          width: i === imgIndex ? "16px" : "6px",
                          height: "6px",
                          background: i === imgIndex ? color : "rgba(255,255,255,0.3)",
                        }}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* Description */}
          <p className="text-gray-400 leading-relaxed text-[15px] mb-6">
            {longDescription || description}
          </p>

          {/* Tech stack */}
          <div className="mb-8">
            <p
              className="text-[10px] font-bold uppercase tracking-[0.2em] mb-3"
              style={{ color: "rgba(255,255,255,0.25)" }}
            >
              Stack
            </p>
            <div className="flex flex-wrap gap-2">
              {technologies.map((tech, i) => (
                <span
                  key={tech}
                  className="px-3 py-1.5 text-xs font-medium text-gray-400 rounded-lg"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    animationDelay: `${i * 40}ms`,
                  }}
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div
            className="flex items-center gap-3 pt-5"
            style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
          >
            {showGithub && githubUrl && (
              <MagneticWrapper strength={0.3}>
                <a
                  href={githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-400 hover:text-white rounded-xl transition-colors duration-150"
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.07)" }}
                >
                  <Github className="w-4 h-4" />
                  GitHub
                </a>
              </MagneticWrapper>
            )}
            {liveUrl && showLiveDemo && (
              <MagneticWrapper strength={0.3}>
                <a
                  href={liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold rounded-xl transition-all duration-150 hover:opacity-90"
                  style={{ background: color, color: "#000" }}
                >
                  <ExternalLink className="w-4 h-4" />
                  {liveDemoLabel}
                </a>
              </MagneticWrapper>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Single Project Row ────────────────────────────────────────────────────────

const ProjectRow: React.FC<{
  project: Project;
  index: number;
  total: number;
  onOpen: (index: number) => void;
}> = ({ project, index, total, onOpen }) => {
  const {
    title,
    description,
    technologies,
    color = "#34d399",
    badge,
    showGithub = true,
    showLiveDemo = true,
    githubUrl,
    liveUrl,
    liveDemoLabel = "Live Demo",
    longDescription,
  } = project;

  const [hovered, setHovered] = useState(false);
  const [visible, setVisible] = useState(false);
  const rowRef = useRef<HTMLDivElement>(null);
  const num = String(index + 1).padStart(2, "0");
  const hasDetails = !!(longDescription || liveUrl || githubUrl);

  useEffect(() => {
    const el = rowRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => e.isIntersecting && setVisible(true),
      { threshold: 0.08 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={rowRef}
      className="relative"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: `opacity 0.55s ease ${index * 80}ms, transform 0.55s cubic-bezier(0.22,1,0.36,1) ${index * 80}ms`,
      }}
    >
      {/* Row */}
      <div
        className="relative flex items-center gap-0 cursor-pointer group"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={() => onOpen(index)}
        style={{
          padding: "28px 0",
          borderBottom: index < total - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
        }}
      >
        {/* Left accent bar */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: "2px",
            background: color,
            borderRadius: "0 2px 2px 0",
            opacity: hovered ? 1 : 0,
            transform: hovered ? "scaleY(1)" : "scaleY(0)",
            transition: "opacity 0.25s ease, transform 0.3s cubic-bezier(0.22,1,0.36,1)",
            transformOrigin: "center",
            boxShadow: `0 0 12px 2px ${color}60`,
          }}
        />

        {/* Row background wash */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(90deg, ${color}08 0%, transparent 60%)`,
            opacity: hovered ? 1 : 0,
            transition: "opacity 0.3s ease",
            pointerEvents: "none",
          }}
        />

        {/* Number */}
        <div
          className="shrink-0 font-black font-mono tabular-nums leading-none select-none"
          style={{
            fontSize: "clamp(11px, 2vw, 13px)",
            color: hovered ? color : "rgba(255,255,255,0.18)",
            width: "clamp(36px, 5vw, 56px)",
            transition: "color 0.25s ease",
            paddingLeft: "12px",
          }}
        >
          {num}
        </div>

        {/* Main content */}
        <div className="flex-1 min-w-0 px-4 sm:px-6">
          {/* Title row */}
          <div className="flex items-center gap-3 flex-wrap mb-2">
            <h3
              className="font-bold text-white leading-tight tracking-tight"
              style={{
                fontSize: "clamp(18px, 3.5vw, 26px)",
                transform: hovered ? "translateX(4px)" : "translateX(0)",
                transition: "transform 0.3s cubic-bezier(0.22,1,0.36,1)",
              }}
            >
              {title}
            </h3>
            {badge && (
              <span
                className="text-[9px] font-black tracking-[0.18em] uppercase px-2 py-0.5 rounded-md shrink-0"
                style={{ color, background: color + "18" }}
              >
                {badge}
              </span>
            )}
          </div>

          {/* Description */}
          <p
            className="text-left text-gray-500 leading-relaxed"
            style={{
              fontSize: "clamp(12px, 1.5vw, 14px)",
              maxWidth: "540px",
            }}
          >
            {description}
          </p>

          {/* Tech tags — slide up on hover */}
          <div
            className="flex flex-wrap gap-1.5 mt-3"
            style={{
              transform: hovered ? "translateY(0)" : "translateY(4px)",
              opacity: hovered ? 1 : 0.5,
              transition: "transform 0.3s ease, opacity 0.3s ease",
            }}
          >
            {technologies.map((tech) => (
              <span
                key={tech}
                className="text-[10px] font-medium px-2 py-0.5 rounded-md"
                style={{
                  color: "rgba(255,255,255,0.35)",
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Right: actions */}
        <div
          className="shrink-0 flex items-center gap-2 pr-2 sm:pr-4"
          style={{
            opacity: hovered ? 1 : 0,
            transform: hovered ? "translateX(0)" : "translateX(8px)",
            transition: "opacity 0.25s ease, transform 0.3s cubic-bezier(0.22,1,0.36,1)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {showGithub && githubUrl && (
            <MagneticWrapper strength={0.4}>
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:text-white transition-colors"
                style={{ background: "rgba(255,255,255,0.06)" }}
                title="GitHub"
              >
                <Github className="w-3.5 h-3.5" />
              </a>
            </MagneticWrapper>
          )}
          {liveUrl && showLiveDemo && (
            <MagneticWrapper strength={0.4}>
              <a
                href={liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg hover:opacity-90 transition-opacity"
                style={{ background: color, color: "#000" }}
              >
                <ArrowUpRight className="w-3.5 h-3.5" />
                {liveDemoLabel}
              </a>
            </MagneticWrapper>
          )}
          {hasDetails && (
            <MagneticWrapper strength={0.4}>
              <button
                onClick={(e) => { e.stopPropagation(); onOpen(index); }}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-lg cursor-pointer transition-all"
                style={{
                  background: "rgba(255,255,255,0.07)",
                  color: "rgba(255,255,255,0.6)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                Details
                <ArrowUpRight className="w-3 h-3" />
              </button>
            </MagneticWrapper>
          )}
        </div>

        {/* Arrow indicator for mobile */}
        <div
          className="shrink-0 sm:hidden pr-3"
          style={{ color: hovered ? color : "rgba(255,255,255,0.15)", transition: "color 0.25s ease" }}
        >
          <ArrowUpRight className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
};

// ─── Projects Grid ─────────────────────────────────────────────────────────────

const ProjectsGrid: React.FC<{ projects: Project[] }> = ({ projects }) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const handleOpen = useCallback((i: number) => setActiveIndex(i), []);
  const handleClose = useCallback(() => setActiveIndex(null), []);

  return (
    <>
      <div
        className="w-full py-4 px-4 sm:px-0"
        style={{
          background: "transparent",
        }}
      >
        <div
          className="max-w-3xl mx-auto"
          style={{
            borderTop: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          {projects.map((project, i) => (
            <ProjectRow
              key={project.title}
              project={project}
              index={i}
              total={projects.length}
              onOpen={handleOpen}
            />
          ))}
        </div>
      </div>

      {activeIndex !== null && (
        <DetailOverlay
          project={projects[activeIndex]}
          index={activeIndex}
          onClose={handleClose}
        />
      )}
    </>
  );
};

export default ProjectsGrid;
