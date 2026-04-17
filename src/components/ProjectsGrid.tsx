import React, { useEffect, useRef, useState } from "react";
import { ExternalLink, Github, X, ChevronLeft, ChevronRight } from "lucide-react";

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
}) => {
  const [visible, setVisible] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [imgIndex, setImgIndex] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setVisible(true),
      { threshold: 0.08 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Close modal on Escape
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
        className="flex flex-col bg-[#111] border border-white/6 rounded-2xl overflow-hidden transition-all duration-500 hover:border-white/12 hover:shadow-xl hover:shadow-black/30 group"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(20px)",
          transition: `opacity 0.5s ease ${index * 60}ms, transform 0.5s ease ${index * 60}ms, border-color 0.2s, box-shadow 0.2s`,
        }}
      >
        {/* Color accent bar */}
        <div className="h-[3px] w-full shrink-0" style={{ background: color }} />

        <div className="flex flex-col flex-1 p-5 gap-3">
          {/* Title row */}
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-base font-bold text-white leading-snug">{title}</h3>
            {badge && (
              <span
                className="shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full text-white tracking-wide"
                style={{ background: color + "33", color }}
              >
                {badge}
              </span>
            )}
          </div>

          {/* Description */}
          <p className="text-sm text-gray-500 leading-relaxed flex-1 text-left">{description}</p>

          {/* Tech tags */}
          <div className="flex flex-wrap gap-1.5">
            {technologies.map((tech) => (
              <span
                key={tech}
                className="px-2.5 py-1 text-xs text-gray-400 bg-white/4 border border-white/6 rounded-full"
              >
                {tech}
              </span>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 pt-1">
            {showGithub && githubUrl && (
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-400 hover:text-white bg-white/4 hover:bg-white/8 border border-white/6 hover:border-white/12 rounded-lg transition-all"
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
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all text-black"
                style={{ background: color }}
              >
                <ExternalLink className="w-3.5 h-3.5" />
                {liveDemoLabel}
              </a>
            )}
            {showDetailsBtn && (
              <button
                onClick={() => setShowModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all text-black cursor-pointer"
                style={{ background: color }}
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Details
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
          onClick={() => setShowModal(false)}
        >
          <div
            className="relative bg-[#111] border border-white/8 rounded-3xl w-full max-w-lg shadow-2xl shadow-black/60 overflow-hidden"
            style={{
              animation: "modalIn 0.2s ease-out forwards",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <style>{`@keyframes modalIn { from { opacity:0; transform:scale(0.96) translateY(8px) } to { opacity:1; transform:scale(1) translateY(0) } }`}</style>

            {/* Color bar */}
            <div className="h-[3px]" style={{ background: color }} />

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

            {/* Content */}
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                  <h2 className="text-xl font-bold text-white">{title}</h2>
                  {badge && (
                    <span
                      className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full tracking-wide"
                      style={{ background: color + "22", color }}
                    >
                      {badge}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-600 hover:text-white transition p-1 cursor-pointer shrink-0"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-400 leading-relaxed mb-5">
                {longDescription || description}
              </p>

              {/* Tech */}
              <div className="mb-6">
                <p className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-2.5">Stack</p>
                <div className="flex flex-wrap gap-1.5">
                  {technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-2.5 py-1 text-xs text-gray-400 bg-white/4 border border-white/6 rounded-full"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 justify-end pt-2 border-t border-white/6">
                {showGithub && githubUrl && (
                  <a
                    href={githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-400 hover:text-white bg-white/4 hover:bg-white/8 border border-white/6 rounded-xl transition-all"
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
                    className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-xl transition-all text-black"
                    style={{ background: color }}
                  >
                    <ExternalLink className="w-4 h-4" />
                    Live Demo
                  </a>
                )}
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white bg-white/4 hover:bg-white/8 border border-white/6 rounded-xl transition-all cursor-pointer"
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project, i) => (
            <ProjectCard key={i} index={i} {...project} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectsGrid;
