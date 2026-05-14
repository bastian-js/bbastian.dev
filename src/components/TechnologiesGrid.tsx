import { useState, useEffect, useRef } from "react";
import { Code2, Braces, Atom, Hash, FileCode, Palette, Smartphone } from "lucide-react";

interface TechnologyItem {
  name: string;
  icon: string;
}

interface TechnologiesGridProps {
  items: TechnologyItem[];
}

const getIcon = (name: string) => {
  const n = name.toLowerCase();
  if (n.includes("expo")) return <Smartphone className="w-5 h-5" />;
  if (n.includes("typescript")) return <Code2 className="w-5 h-5" />;
  if (n.includes("javascript")) return <Braces className="w-5 h-5" />;
  if (n.includes("react")) return <Atom className="w-5 h-5" />;
  if (n.includes("c#") || n.includes("csharp")) return <Hash className="w-5 h-5" />;
  if (n.includes("html")) return <FileCode className="w-5 h-5" />;
  if (n.includes("css")) return <Palette className="w-5 h-5" />;
  if (n.includes("mariadb")) return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round">
      <path d="M5 19V7l7 6 7-6v12" />
    </svg>
  );
  return <Code2 className="w-5 h-5" />;
};

const TechCard = ({ item, index = 0, visible = true }: { item: TechnologyItem; index?: number; visible?: boolean }) => {
  const [hovered, setHovered] = useState(false);
  const [imgFailed, setImgFailed] = useState(false);

  const useImg = item.icon && !imgFailed;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(16px)",
        transition: `opacity 0.45s cubic-bezier(0.22,1,0.36,1) ${index * 55}ms, transform 0.45s cubic-bezier(0.22,1,0.36,1) ${index * 55}ms`,
      }}
      className={`flex items-center gap-4 px-6 py-5 rounded-2xl border transition-colors duration-200 cursor-default ${
        hovered
          ? "bg-white/6 border-white/14 -translate-y-0.5"
          : "bg-white/3 border-white/7"
      }`}
    >
      <div
        className={`w-11 h-11 rounded-[14px] border border-white/10 flex items-center justify-center shrink-0 transition-all duration-200 ${
          hovered ? "bg-white/10 text-white/95" : "bg-white/6 text-white/55"
        }`}
      >
        {useImg ? (
          <img
            src={item.icon}
            alt={item.name}
            className={`w-6 h-6 object-contain transition-opacity duration-200 ${hovered ? "opacity-95" : "opacity-60"}`}
            onError={() => setImgFailed(true)}
          />
        ) : (
          getIcon(item.name)
        )}
      </div>
      <span
        className={`text-sm font-medium tracking-tight transition-colors duration-200 ${
          hovered ? "text-white/90" : "text-white/50"
        }`}
      >
        {item.name}
      </span>
    </div>
  );
};

const TechnologiesGrid = ({ items }: TechnologiesGridProps) => {
  const [visible, setVisible] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = gridRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.1 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div className="w-full bg-[#0a0a0a] py-8 px-4">
      <div ref={gridRef} className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
          {items.map((item, i) => (
            <TechCard key={i} item={item} index={i} visible={visible} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TechnologiesGrid;
