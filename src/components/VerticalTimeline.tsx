import React, { useEffect, useRef, useState } from "react";

interface TimelineItem {
  year: string;
  title: string;
  description: string;
  color?: string;
  link?: { label: string; url: string };
}

interface VerticalTimelineProps {
  items: TimelineItem[];
}

const VerticalTimeline: React.FC<VerticalTimelineProps> = ({ items }) => {
  const [visibleItems, setVisibleItems] = useState<boolean[]>(
    new Array(items.length).fill(false)
  );
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  const defaultColors = [
    "#6EE7B7",
    "#3B82F6",
    "#F59E0B",
    "#EF4444",
    "#8B5CF6",
    "#EC4899",
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
        { threshold: 0.15 }
      );

      observer.observe(ref);
      return observer;
    });

    return () => {
      observers.forEach((observer) => observer?.disconnect());
    };
  }, [items.length]);

  return (
    <div className="w-full bg-[#0a0a0a] py-16 px-4">
      <div className="max-w-6xl mx-auto relative">

        {/* Desktop: center line */}
        <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-[#2a2a2a] -translate-x-1/2" />

        {/* Mobile: left line */}
        <div className="md:hidden absolute left-4 top-0 bottom-0 w-0.5 bg-[#2a2a2a]" />

        <div className="relative space-y-10 md:space-y-20">
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
                {/* Desktop dot */}
                <div
                  className="hidden md:block absolute left-1/2 top-0 -translate-x-1/2 w-4 h-4 rounded-full bg-[#0a0a0a] border-2 z-10 transition-all duration-300 ease-in-out hover:scale-150 hover:rotate-180"
                  style={{ borderColor: itemColor }}
                />

                {/* Mobile dot */}
                <div
                  className="md:hidden absolute left-4 top-1.5 -translate-x-1/2 w-3 h-3 rounded-full bg-[#0a0a0a] border-2 z-10"
                  style={{ borderColor: itemColor }}
                />

                {/* Desktop: alternating left/right layout */}
                <div
                  className={`hidden md:flex ${
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
                    <div className={isLeft ? "text-right" : "text-left"}>
                      <h3
                        className="text-2xl font-bold mb-2"
                        style={{ color: itemColor }}
                      >
                        {item.year}
                      </h3>
                      <h4 className="text-xl font-semibold text-white mb-3">
                        {item.title}
                      </h4>
                      <p className="text-gray-400 leading-relaxed">
                        {item.description}
                      </p>
                      {item.link && (
                        <a href={item.link.url} target="_blank" rel="noopener noreferrer" className="inline-block mt-2 text-sm text-emerald-400 hover:underline">
                          {item.link.label} →
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* Mobile: single column layout */}
                <div
                  className={`md:hidden pl-10 transition-all duration-700 ease-out ${
                    visibleItems[index]
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 -translate-x-4"
                  }`}
                >
                  <h3
                    className="text-lg font-bold mb-1"
                    style={{ color: itemColor }}
                  >
                    {item.year}
                  </h3>
                  <h4 className="text-base font-semibold text-white mb-1.5">
                    {item.title}
                  </h4>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {item.description}
                  </p>
                  {item.link && (
                    <a href={item.link.url} target="_blank" rel="noopener noreferrer" className="inline-block mt-1.5 text-xs text-emerald-400 hover:underline">
                      {item.link.label} →
                    </a>
                  )}
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
