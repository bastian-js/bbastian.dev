import React, { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Github, X, ChevronLeft, ChevronRight } from "lucide-react";

interface Project {
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

interface ProjectsGridProps {
  projects: Project[];
}

const ProjectCard: React.FC<Project & { index: number }> = ({
  title,
  description,
  technologies,
  images,
  githubUrl,
  liveUrl,
  color = "#34d399",
  showGithub = true,
  showLiveDemo = true,
  longDescription,
  badge,
  liveDemoLabel = "Live Demo",
  index,
  featured = false,
}) => {
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [imgIndex, setImgIndex] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setVisible(true),
      { threshold: 0.06 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!showModal) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setShowModal(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showModal]);

  const hasDetails = !!(longDescription || (images && images.length > 0));
  const showDetailsBtn = showLiveDemo && !liveUrl && hasDetails;

  return (
    <>
      <div
        ref={cardRef}
        className={`relative flex flex-col rounded-2xl overflow-hidden${featured ? " sm:col-span-2" : ""}`}
        style={{
          opacity: visible ? 1 : 0,
          transform: visible
            ? hovered ? "translateY(-3px)" : "translateY(0)"
            : "translateY(24px)",
          transition: `opacity 0.5s ease ${index * 70}ms, transform 0.4s cubic-bezier(0.34,1.56,0.64,1) ${visible ? "0ms" : `${index * 70}ms`}, border-color 0.25s, box-shadow 0.3s`,
          background: "#141414",
          border: `1px solid ${hovered ? "rgba(255,255,255,0.13)" : "rgba(255,255,255,0.07)"}`,
          boxShadow: hovered
            ? `0 12px 40px rgba(0,0,0,0.6), 0 4px 16px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.04)`
            : "0 2px 8px rgba(0,0,0,0.4)",
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Glow seam — the only color on the card */}
        <div
          style={{
            height: "1px",
            background: color,
            boxShadow: `0 0 ${hovered ? "20px" : "12px"} 2px ${color + (hovered ? "90" : "60")}, 0 0 ${hovered ? "40px" : "24px"} 6px ${color + (hovered ? "40" : "25")}`,
            transition: "box-shadow 0.3s ease",
          }}
        />

        <div className={`flex flex-col flex-1 p-6 gap-4 ${featured ? "sm:p-7 items-center text-center" : ""}`}>
          {/* Title + badge */}
          <div className={`flex flex-col gap-2 ${featured ? "items-center" : ""}`}>
            {badge && (
              <span
                className="self-start text-[10px] font-semibold px-2 py-0.5 rounded-md tracking-widest uppercase"
                style={{ color, background: color + "15" }}
              >
                {badge}
              </span>
            )}
            <h3
              className={`font-semibold text-white leading-tight tracking-tight ${featured ? "text-2xl" : "text-lg"}`}
            >
              {title}
            </h3>
          </div>

          {/* Description */}
          <p
            className={`text-gray-500 leading-relaxed flex-1 ${featured ? "text-sm max-w-md" : "text-[13px]"}`}
          >
            {description}
          </p>

          {/* Tech tags */}
          <div className={`flex flex-wrap gap-1.5 ${featured ? "justify-center" : ""}`}>
            {technologies.map((tech) => (
              <span
                key={tech}
                className="px-2 py-0.5 text-[11px] font-medium text-gray-500 rounded-md"
                style={{ background: "rgba(255,255,255,0.05)" }}
              >
                {tech}
              </span>
            ))}
          </div>

          {/* Actions */}
          <div className={`flex items-center gap-2 pt-1 ${featured ? "justify-center" : ""}`}>
            {showGithub && githubUrl && (
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-500 hover:text-white rounded-lg transition-colors duration-200"
                style={{ background: "rgba(255,255,255,0.05)" }}
              >
                <Github className="w-3.5 h-3.5" />
                GitHub
              </a>
            )}
            {liveUrl && showLiveDemo && (
              <a
                href={liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 hover:opacity-90"
                style={{ background: color, color: "#000" }}
              >
                <ArrowUpRight className="w-3.5 h-3.5" />
                {liveDemoLabel}
              </a>
            )}
            {showDetailsBtn && (
              <button
                onClick={() => setShowModal(true)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 hover:opacity-90 cursor-pointer"
                style={{ background: color, color: "#000" }}
              >
                <ArrowUpRight className="w-3.5 h-3.5" />
                Details
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl"
          onClick={() => setShowModal(false)}
        >
          <div
            className="relative w-full max-w-lg overflow-hidden rounded-3xl"
            style={{
              background: "#161616",
              border: "1px solid rgba(255,255,255,0.1)",
              boxShadow: "0 32px 80px rgba(0,0,0,0.7), 0 8px 32px rgba(0,0,0,0.5)",
              animation: "modalIn 0.22s cubic-bezier(0.34,1.56,0.64,1) forwards",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <style>{`@keyframes modalIn { from { opacity:0; transform:scale(0.94) translateY(12px) } to { opacity:1; transform:scale(1) translateY(0) } }`}</style>

            {/* Glow seam */}
            <div
              style={{
                height: "1px",
                background: color,
                boxShadow: `0 0 20px 3px ${color}70, 0 0 40px 8px ${color}30`,
              }}
            />

            {/* Image carousel */}
            {images && images.length > 0 && (
              <div className="relative w-full h-52 bg-[#0a0a0a] overflow-hidden">
                <img
                  src={images[imgIndex]}
                  alt={`${title} ${imgIndex + 1}`}
                  className="w-full h-full object-cover"
                />
                {images.length > 1 && (
                  <>
                    <button
                      onClick={() => setImgIndex((p) => (p - 1 + images.length) % images.length)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1.5 rounded-full transition cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setImgIndex((p) => (p + 1) % images.length)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1.5 rounded-full transition cursor-pointer"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                      {images.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setImgIndex(i)}
                          className={`w-1.5 h-1.5 rounded-full transition-all cursor-pointer ${i === imgIndex ? "bg-white scale-125" : "bg-white/30"}`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            <div className="p-6">
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex flex-col gap-1.5">
                  {badge && (
                    <span
                      className="self-start text-[10px] font-semibold px-2 py-0.5 rounded-md tracking-widest uppercase"
                      style={{ color, background: color + "15" }}
                    >
                      {badge}
                    </span>
                  )}
                  <h2 className="text-xl font-semibold text-white tracking-tight">{title}</h2>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-600 hover:text-white transition p-1 cursor-pointer shrink-0 mt-0.5"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-sm text-gray-500 leading-relaxed mb-5">
                {longDescription || description}
              </p>

              <div className="mb-6">
                <p className="text-[10px] font-semibold text-gray-600 uppercase tracking-widest mb-2.5">Stack</p>
                <div className="flex flex-wrap gap-1.5">
                  {technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-2.5 py-1 text-xs text-gray-500 rounded-md"
                      style={{ background: "rgba(255,255,255,0.05)" }}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div
                className="flex items-center gap-2 justify-end pt-4"
                style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
              >
                {showGithub && githubUrl && (
                  <a
                    href={githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-500 hover:text-white rounded-xl transition-colors"
                    style={{ background: "rgba(255,255,255,0.05)" }}
                  >
                    <Github className="w-4 h-4" />
                    GitHub
                  </a>
                )}
                {liveUrl && (
                  <a
                    href={liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-xl transition-all hover:opacity-90"
                    style={{ background: color, color: "#000" }}
                  >
                    <ArrowUpRight className="w-4 h-4" />
                    Live Demo
                  </a>
                )}
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-white rounded-xl transition-colors cursor-pointer"
                  style={{ background: "rgba(255,255,255,0.05)" }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const ProjectsGrid: React.FC<ProjectsGridProps> = ({ projects }) => {
  return (
    <div className="w-full bg-[#0a0a0a] py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {projects.map((project, i) => (
            <ProjectCard key={i} index={i} {...project} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectsGrid;
