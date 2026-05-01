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

const DEFAULT_COLORS = [
  "#6EE7B7", "#3B82F6", "#F59E0B", "#EF4444",
  "#8B5CF6", "#EC4899", "#34d399", "#F97316",
  "#06B6D4", "#84CC16",
];

const DOT_SIZE = 10; // px, w-2.5 h-2.5
const CONNECTOR_TOP = 28; // px from top of card row where the line runs

const Card: React.FC<{
  item: TimelineItem;
  itemIndex: number;
  visible: boolean;
  slideFrom: "left" | "right";
}> = ({ item, itemIndex, visible, slideFrom }) => {
  const [hovered, setHovered] = useState(false);
  const color = item.color || DEFAULT_COLORS[itemIndex % DEFAULT_COLORS.length];

  return (
    <div
      className="relative flex flex-col gap-3 rounded-2xl overflow-hidden p-5"
      style={{
        background: "#141414",
        border: `1px solid ${hovered ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.07)"}`,
        boxShadow: hovered
          ? "0 8px 32px rgba(0,0,0,0.5), 0 2px 8px rgba(0,0,0,0.3)"
          : "0 2px 8px rgba(0,0,0,0.3)",
        opacity: visible ? 1 : 0,
        transform: visible
          ? "translateX(0)"
          : `translateX(${slideFrom === "left" ? "-24px" : "24px"})`,
        transition: `opacity 0.55s ease ${itemIndex * 55}ms, transform 0.55s cubic-bezier(0.22,1,0.36,1) ${itemIndex * 55}ms, border-color 0.2s, box-shadow 0.25s`,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Glow seam */}
      <div
        style={{
          position: "absolute",
          top: 0, left: 0, right: 0,
          height: "1px",
          background: color,
          boxShadow: `0 0 ${hovered ? "18px" : "10px"} 2px ${color + (hovered ? "80" : "55")}, 0 0 ${hovered ? "36px" : "20px"} 4px ${color + "25"}`,
          transition: "box-shadow 0.3s ease",
        }}
      />

      <span
        className="text-[10px] font-semibold tracking-widest uppercase"
        style={{ color }}
      >
        {item.year}
      </span>

      <h3 className="text-[15px] font-semibold text-white leading-snug">
        {item.title}
      </h3>

      <p className="text-[13px] text-gray-500 leading-relaxed">
        {item.description}
      </p>

      {item.link && (
        <a
          href={item.link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-medium hover:opacity-75 transition-opacity w-fit"
          style={{ color }}
        >
          {item.link.label} →
        </a>
      )}
    </div>
  );
};

const VerticalTimeline: React.FC<VerticalTimelineProps> = ({ items }) => {
  const [visibleItems, setVisibleItems] = useState<boolean[]>(
    new Array(items.length).fill(false)
  );
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Group items into pairs
  const pairs: [TimelineItem, TimelineItem | null][] = [];
  for (let i = 0; i < items.length; i += 2) {
    pairs.push([items[i], items[i + 1] ?? null]);
  }

  useEffect(() => {
    const observers = rowRefs.current.map((ref, rowIdx) => {
      if (!ref) return null;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            const idxA = rowIdx * 2;
            const idxB = rowIdx * 2 + 1;
            setVisibleItems((prev) => {
              const next = [...prev];
              next[idxA] = true;
              if (idxB < items.length) next[idxB] = true;
              return next;
            });
          }
        },
        { threshold: 0.1 }
      );
      observer.observe(ref);
      return observer;
    });
    return () => observers.forEach((o) => o?.disconnect());
  }, [items.length]);

  // gap-16 = 64px. Centers of each column:
  // Left col center:  calc(25% - 16px)
  // Right col center: calc(75% + 16px)
  // Gap left edge:    calc(50% - 32px)
  // Gap right edge:   calc(50% + 32px)
  const GAP_PX = 64;
  const HALF_DOT = DOT_SIZE / 2;

  return (
    <div className="w-full bg-[#0a0a0a] py-16 px-4">
      <div className="max-w-4xl mx-auto">

        {/* ── Desktop snake layout ── */}
        <div className="hidden md:block">
          {pairs.map(([a, b], rowIdx) => {
            const isEvenRow = rowIdx % 2 === 0;
            const isLastRow = rowIdx === pairs.length - 1;

            // Even rows: a = left, b = right  (path: L → R, connector drops on RIGHT)
            // Odd rows:  a = right, b = left  (path: R → L, connector drops on LEFT)
            const leftItem  = isEvenRow ? a        : (b ?? null);
            const rightItem = isEvenRow ? (b ?? null) : a;
            const leftIdx   = isEvenRow ? rowIdx * 2     : rowIdx * 2 + 1;
            const rightIdx  = isEvenRow ? rowIdx * 2 + 1 : rowIdx * 2;

            const leftColor  = leftItem?.color  || DEFAULT_COLORS[leftIdx  % DEFAULT_COLORS.length];
            const rightColor = rightItem?.color || DEFAULT_COLORS[rightIdx % DEFAULT_COLORS.length];

            return (
              <div key={rowIdx}>
                {/* Cards row */}
                <div
                  ref={(el) => { rowRefs.current[rowIdx] = el; }}
                  className="relative grid grid-cols-2 gap-16 items-start"
                >
                  {/* Left card */}
                  <div>
                    {leftItem && (
                      <Card
                        item={leftItem}
                        itemIndex={leftIdx}
                        visible={visibleItems[leftIdx]}
                        slideFrom="left"
                      />
                    )}
                  </div>

                  {/* Right card */}
                  <div>
                    {rightItem && (
                      <Card
                        item={rightItem}
                        itemIndex={rightIdx}
                        visible={visibleItems[rightIdx]}
                        slideFrom="right"
                      />
                    )}
                  </div>

                  {/* Horizontal connector line (spans the gap) */}
                  <div
                    className="absolute z-0 bg-[#252525]"
                    style={{
                      top: CONNECTOR_TOP - 0.5,
                      height: "1px",
                      left: `calc(50% - ${GAP_PX / 2}px)`,
                      right: `calc(50% - ${GAP_PX / 2}px)`,
                    }}
                  />

                  {/* Left dot (right edge of left card / left edge of gap) */}
                  {leftItem && (
                    <div
                      className="absolute z-10 rounded-full"
                      style={{
                        top: CONNECTOR_TOP - HALF_DOT,
                        left: `calc(50% - ${GAP_PX / 2 + HALF_DOT}px)`,
                        width: DOT_SIZE,
                        height: DOT_SIZE,
                        background: "#0f0f0f",
                        border: `2px solid ${leftColor}`,
                        boxShadow: `0 0 6px ${leftColor}60`,
                      }}
                    />
                  )}

                  {/* Right dot (right edge of gap / left edge of right card) */}
                  {rightItem && (
                    <div
                      className="absolute z-10 rounded-full"
                      style={{
                        top: CONNECTOR_TOP - HALF_DOT,
                        left: `calc(50% + ${GAP_PX / 2 - HALF_DOT}px)`,
                        width: DOT_SIZE,
                        height: DOT_SIZE,
                        background: "#0f0f0f",
                        border: `2px solid ${rightColor}`,
                        boxShadow: `0 0 6px ${rightColor}60`,
                      }}
                    />
                  )}
                </div>

                {/* Vertical connector to next row */}
                {!isLastRow && (
                  <div className="relative h-16">
                    <div
                      className="absolute top-0 bottom-0 w-px bg-[#252525]"
                      style={{
                        // Align with the center of the appropriate card column
                        left: isEvenRow
                          ? `calc(75% + ${GAP_PX / 4}px)`
                          : `calc(25% - ${GAP_PX / 4}px)`,
                      }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ── Mobile: simple vertical list ── */}
        <div className="md:hidden relative">
          <div className="absolute left-3 top-0 bottom-0 w-px bg-[#252525]" />
          <div className="space-y-5 pl-9">
            {items.map((item, i) => {
              const color = item.color || DEFAULT_COLORS[i % DEFAULT_COLORS.length];
              return (
                <div
                  key={i}
                  className="relative"
                  style={{
                    opacity: visibleItems[i] ? 1 : 0,
                    transform: visibleItems[i] ? "translateY(0)" : "translateY(10px)",
                    transition: `opacity 0.5s ease ${i * 55}ms, transform 0.5s ease ${i * 55}ms`,
                  }}
                >
                  {/* Mobile dot */}
                  <div
                    className="absolute rounded-full"
                    style={{
                      top: 18,
                      left: -30,
                      width: 8,
                      height: 8,
                      background: "#0f0f0f",
                      border: `2px solid ${color}`,
                    }}
                  />

                  <div
                    className="rounded-xl overflow-hidden p-4 relative"
                    style={{
                      background: "#141414",
                      border: "1px solid rgba(255,255,255,0.07)",
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        top: 0, left: 0, right: 0,
                        height: "1px",
                        background: color,
                        boxShadow: `0 0 10px 2px ${color}55`,
                      }}
                    />
                    <span
                      className="block text-[10px] font-semibold tracking-widest uppercase mb-1.5"
                      style={{ color }}
                    >
                      {item.year}
                    </span>
                    <h3 className="text-sm font-semibold text-white mb-1.5">{item.title}</h3>
                    <p className="text-xs text-gray-500 leading-relaxed">{item.description}</p>
                    {item.link && (
                      <a
                        href={item.link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block mt-2 text-[11px] font-medium hover:opacity-75 transition-opacity"
                        style={{ color }}
                      >
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
    </div>
  );
};

export default VerticalTimeline;
