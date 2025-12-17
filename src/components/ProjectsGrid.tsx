import React from "react";
import { ExternalLink, Github } from "lucide-react";
import { useEffect, useRef, useState } from "react";

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
}

interface ProjectsGridProps {
  projects: Project[];
}

const ProjectCard: React.FC<Project> = ({
  title,
  description,
  technologies,
  image,
  images,
  githubUrl,
  liveUrl,
  color = "#3B82F6",
  showGithub = true,
  showLiveDemo = true,
  longDescription,
  badge,
  badgeColor = "#10B981",
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleLiveDemoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowModal(true);
  };

  const nextImage = () => {
    if (images) {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }
  };

  const prevImage = () => {
    if (images) {
      setCurrentImageIndex(
        (prev) => (prev - 1 + images.length) % images.length
      );
    }
  };

  return (
    <>
      <div
        ref={cardRef}
        className={`
        bg-[#1a1a1a] rounded-xl overflow-hidden
        border border-white/5
        hover:border-white/10
        transition-all duration-500 ease-out
        hover:scale-105 hover:shadow-2xl
        ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}
      `}
      >
        <div className="p-6 flex flex-col h-full">
          <h3 className="text-2xl font-bold mb-3" style={{ color }}>
            {title}
          </h3>

          <p className="text-gray-400 leading-relaxed mb-4 !text-base">
            {description}
          </p>

          <div className="flex flex-wrap gap-2 mb-4">
            {technologies.map((tech, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-[#0a0a0a] text-gray-300 text-sm rounded-full border border-white/10"
              >
                {tech}
              </span>
            ))}
          </div>

          <div className="flex gap-3 mt-auto pt-4">
            {showGithub && githubUrl && (
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-[#0a0a0a] text-white rounded-lg hover:bg-white/10 transition-colors"
              >
                <Github className="w-4 h-4" />
                <span>GitHub</span>
              </a>
            )}

            {showLiveDemo && (
              <>
                {liveUrl ? (
                  <a
                    href={liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-white transition-colors hover:opacity-80"
                    style={{ backgroundColor: color }}
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Live Demo</span>
                  </a>
                ) : (
                  <button
                    onClick={handleLiveDemoClick}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-white transition-colors hover:opacity-80 whitespace-nowrap cursor-pointer"
                    style={{ backgroundColor: color }}
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>View Details</span>
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {showModal && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowModal(false)}
        >
          <div
            className="
              bg-[#1a1a1a] rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto 
              border border-white/10 transform transition-all duration-300 
              animate-modalIn
            "
            onClick={(e) => e.stopPropagation()}
          >
            {images && images.length > 0 ? (
              <div className="relative w-full h-64 bg-[#0a0a0a] overflow-hidden">
                <img
                  src={images[currentImageIndex]}
                  alt={`${title} - Image ${currentImageIndex + 1}`}
                  className="w-full h-full object-cover"
                />
                {badge && (
                  <div
                    className="absolute top-4 right-4 px-3 py-1 rounded-full text-white text-sm font-semibold shadow-lg"
                    style={{ backgroundColor: badgeColor }}
                  >
                    {badge}
                  </div>
                )}

                {images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                    >
                      ←
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                    >
                      →
                    </button>

                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                      {images.map((_, index) => (
                        <div
                          key={index}
                          className={`w-2 h-2 rounded-full transition-colors ${
                            index === currentImageIndex
                              ? "bg-white"
                              : "bg-white/30"
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            ) : badge ? (
              <div className="relative w-full h-64 bg-[#0a0a0a] overflow-hidden flex items-center justify-center">
                <div
                  className="absolute top-4 right-4 px-3 py-1 rounded-full text-white text-sm font-semibold shadow-lg"
                  style={{ backgroundColor: badgeColor }}
                >
                  {badge}
                </div>
              </div>
            ) : null}

            <div className="p-8">
              <h2 className="text-3xl font-bold mb-4" style={{ color }}>
                {title}
              </h2>

              <p className="text-gray-300 text-lg leading-relaxed mb-6">
                {longDescription || description}
              </p>

              <div className="mb-6">
                <h3 className="text-white font-semibold mb-3 flex flex-wrap justify-start">
                  Technologies Used:
                </h3>
                <div className="flex flex-wrap gap-2">
                  {technologies.map((tech, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-[#0a0a0a] text-gray-300 rounded-lg border border-white/10"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 flex-wrap justify-end mt-10">
                {showGithub && githubUrl && (
                  <a
                    href={githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-6 py-3 bg-[#0a0a0a] text-white rounded-lg hover:bg-white/10 transition-colors"
                  >
                    <Github className="w-5 h-5" />
                    <span>View on GitHub</span>
                  </a>
                )}

                <button
                  onClick={() => setShowModal(false)}
                  className="flex items-center gap-2 px-6 py-3 rounded-lg text-white transition-colors hover:opacity-80 cursor-pointer"
                  style={{ backgroundColor: color }}
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
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <ProjectCard key={index} {...project} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectsGrid;
