import React from "react";
import { Code2, Braces, Atom, Hash, FileCode, Palette } from "lucide-react";

interface TechnologyItem {
  name: string;
  icon: string;
}

interface TechnologiesGridProps {
  items: TechnologyItem[];
}

const getIcon = (name: string) => {
  const lowerName = name.toLowerCase();

  if (lowerName.includes("typescript")) {
    return <Code2 className="w-12 h-12" />;
  }
  if (lowerName.includes("javascript")) {
    return <Braces className="w-12 h-12" />;
  }
  if (lowerName.includes("react")) {
    return <Atom className="w-12 h-12" />;
  }
  if (lowerName.includes("c#") || lowerName.includes("csharp")) {
    return <Hash className="w-12 h-12" />;
  }
  if (lowerName.includes("html")) {
    return <FileCode className="w-12 h-12" />;
  }
  if (lowerName.includes("css")) {
    return <Palette className="w-12 h-12" />;
  }

  return <Code2 className="w-12 h-12" />;
};

const gradients = [
  "from-blue-950 to-blue-900",
  "from-yellow-950 to-yellow-900",
  "from-cyan-950 to-cyan-900",
  "from-purple-950 to-purple-900",
  "from-orange-950 to-orange-900",
  "from-blue-950 to-indigo-900",
];

const iconColors = [
  "text-blue-400",
  "text-yellow-400",
  "text-cyan-400",
  "text-purple-400",
  "text-orange-400",
  "text-blue-400",
];

const TechnologiesGrid: React.FC<TechnologiesGridProps> = ({ items }) => {
  return (
    <div className="w-full py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-rows-3 grid-flow-col auto-cols-fr gap-5">
          {items.map((item, index) => {
            const gradient = gradients[index % gradients.length];
            const iconColor = iconColors[index % iconColors.length];

            return (
              <div
                key={index}
                className={`
                  h-32 rounded-xl
                  flex flex-col items-center justify-center
                  bg-gradient-to-br ${gradient}
                  border border-white/5
                  shadow-lg
                  transition-all duration-300 ease-out
                  hover:scale-105 hover:shadow-2xl hover:border-white/10
                `}
              >
                <div className={iconColor}>{getIcon(item.name)}</div>

                <span className="text-white/95 font-semibold text-sm tracking-wide mt-3">
                  {item.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TechnologiesGrid;
