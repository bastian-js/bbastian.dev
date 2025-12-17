import React, { useEffect, useRef, useState } from "react";
import { ExternalLink, Github } from "lucide-react";

interface ProjectCardProps {
  title: string;
  description: string;
  technologies: string[];
  image?: string;
  githubUrl?: string;
  liveUrl?: string;
  color?: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  title,
  description,
  technologies,
  image,
  githubUrl,
  liveUrl,
  color = "#3B82F6",
}) => {
  const [isVisible, setIsVisible] = useState(false);
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

  return (
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
      {/* Image */}
      {image && (
        <div className="w-full h-48 bg-[#0a0a0a] overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
          />
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        {/* Title with color accent */}
        <h3 className="text-2xl font-bold mb-3" style={{ color }}>
          {title}
        </h3>

        {/* Description */}
        <p className="text-gray-400 leading-relaxed mb-4">{description}</p>

        {/* Technologies */}
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

        {/* Links */}
        <div className="flex gap-3 mt-4">
          {githubUrl && (
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
          {liveUrl && (
            <a
              href={liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-white transition-colors"
              style={{ backgroundColor: color }}
            >
              <ExternalLink className="w-4 h-4" />
              <span>Live Demo</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
