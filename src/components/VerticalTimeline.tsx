import React, { useEffect, useRef, useState } from "react";

interface TimelineItem {
  year: string;
  title: string;
  description: string;
  color?: string;
}

interface VerticalTimelineProps {
  items: TimelineItem[];
}

const VerticalTimeline: React.FC<VerticalTimelineProps> = ({ items }) => {
  const [visibleItems, setVisibleItems] = useState<boolean[]>(
    new Array(items.length).fill(false)
  );
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Default Farben falls keine angegeben
  const defaultColors = [
    "#6EE7B7", // Grün
    "#3B82F6", // Blau
    "#F59E0B", // Orange
    "#EF4444", // Rot
    "#8B5CF6", // Lila
    "#EC4899", // Pink
  ];

  useEffect(() => {
    const observers = itemRefs.current.map((ref, index) => {
      if (!ref) return null;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setVisibleItems((prev) => {
                const newVisible = [...prev];
                newVisible[index] = true;
                return newVisible;
              });
            }
          });
        },
        { threshold: 0.2 }
      );

      observer.observe(ref);
      return observer;
    });

    return () => {
      observers.forEach((observer) => observer?.disconnect());
    };
  }, [items.length]);

  return (
    <div className="w-full min-h-screen bg-[#0a0a0a] py-16 px-4">
      <div className="max-w-6xl mx-auto relative">
        {/* Mittellinie */}
        <div className="absolute left-1/2 top-0 bottom-0 w-[2px] bg-[#2a2a2a] -translate-x-1/2" />

        {/* Timeline Items */}
        <div className="relative space-y-20">
          {items.map((item, index) => {
            const isLeft = index % 2 === 0;
            const itemColor =
              item.color || defaultColors[index % defaultColors.length];

            return (
              <div
                key={index}
                ref={(el) => {
                  itemRefs.current[index] = el;
                }}
                className="relative"
              >
                {/* Kreis auf der Linie - gleiche Farbe wie Year */}
                <div
                  className="absolute left-1/2 top-0 -translate-x-1/2 w-4 h-4 rounded-full bg-[#0a0a0a] border-2 z-10 transition-all duration-300 ease-in-out hover:scale-150 hover:rotate-180"
                  style={{ borderColor: itemColor }}
                />

                {/* Content Container mit Fly-in Animation */}
                <div
                  className={`flex ${
                    isLeft ? "justify-start" : "justify-end"
                  } transition-all duration-700 ease-out ${
                    visibleItems[index]
                      ? "opacity-100 translate-x-0"
                      : `opacity-0 ${
                          isLeft ? "-translate-x-20" : "translate-x-20"
                        }`
                  }`}
                >
                  <div className={`w-[45%] ${isLeft ? "pr-12" : "pl-12"}`}>
                    <div className={`${isLeft ? "text-right" : "text-left"}`}>
                      {/* Year mit individueller Farbe */}
                      <h3
                        className="text-2xl font-bold mb-2"
                        style={{ color: itemColor }}
                      >
                        {item.year}
                      </h3>

                      {/* Title */}
                      <h4 className="text-xl font-semibold text-white mb-3">
                        {item.title}
                      </h4>

                      {/* Description */}
                      <p className="text-gray-400 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default VerticalTimeline;
