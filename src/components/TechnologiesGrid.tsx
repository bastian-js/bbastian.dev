import { useState } from "react";
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
  return <Code2 className="w-5 h-5" />;
};

const TechCard = ({ item, isWide }: { item: TechnologyItem; isWide: boolean }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`flex items-center gap-4 px-6 py-5 rounded-2xl border transition-all duration-200 cursor-default ${
        isWide ? "col-span-full" : ""
      } ${
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
        {getIcon(item.name)}
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
  const hasOdd = items.length % 2 !== 0;

  return (
    <div className="w-full bg-[#0a0a0a] py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {items.map((item, i) => (
            <TechCard
              key={i}
              item={item}
              isWide={hasOdd && i === items.length - 1}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TechnologiesGrid;
