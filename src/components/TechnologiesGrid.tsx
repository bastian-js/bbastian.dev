import { useState } from "react";
import {
  Code2,
  Braces,
  Atom,
  Hash,
  FileCode,
  Palette,
  Smartphone,
} from "lucide-react";

interface TechnologyItem {
  name: string;
  icon: string;
}

interface TechnologiesGridProps {
  items: TechnologyItem[];
}

interface TechCardProps {
  item: TechnologyItem;
  isWide: boolean;
}

const getIcon = (name: string) => {
  const lowerName = name.toLowerCase();
  const cls = "h-6 w-6";
  if (lowerName.includes("expo")) return <Smartphone className={cls} />;
  if (lowerName.includes("typescript")) return <Code2 className={cls} />;
  if (lowerName.includes("javascript")) return <Braces className={cls} />;
  if (lowerName.includes("react")) return <Atom className={cls} />;
  if (lowerName.includes("c#") || lowerName.includes("csharp"))
    return <Hash className={cls} />;
  if (lowerName.includes("html")) return <FileCode className={cls} />;
  if (lowerName.includes("css")) return <Palette className={cls} />;
  return <Code2 className={cls} />;
};

const TechCard = ({ item, isWide }: TechCardProps) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        gridColumn: isWide ? "1 / -1" : undefined,
        background: hovered
          ? "rgba(255,255,255,0.06)"
          : "rgba(255,255,255,0.03)",
        border: `1px solid ${hovered ? "rgba(255,255,255,0.14)" : "rgba(255,255,255,0.07)"}`,
        borderRadius: "20px",
        padding: "28px 32px",
        display: "flex",
        alignItems: "center",
        gap: "20px",
        cursor: "default",
        transition: "all 0.25s cubic-bezier(0.4,0,0.2,1)",
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* subtle top shimmer */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "20px",
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 60%)",
          pointerEvents: "none",
        }}
      />

      {/* icon container */}
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: "14px",
          background: hovered
            ? "rgba(255,255,255,0.1)"
            : "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: hovered ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.55)",
          transition: "all 0.25s cubic-bezier(0.4,0,0.2,1)",
          flexShrink: 0,
        }}
      >
        {getIcon(item.name)}
      </div>

      <span
        style={{
          fontFamily:
            "-apple-system, 'SF Pro Display', BlinkMacSystemFont, 'Helvetica Neue', sans-serif",
          fontSize: "15px",
          fontWeight: 500,
          letterSpacing: "-0.01em",
          color: hovered ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.5)",
          transition: "color 0.25s cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        {item.name}
      </span>
    </div>
  );
};

const TechnologiesGrid = ({ items }: TechnologiesGridProps) => {
  const hasOdd = items.length % 2 !== 0;

  return (
    <section
      style={{
        position: "relative",
        width: "100%",
        padding: "32px 24px",
        fontFamily:
          "-apple-system, 'SF Pro Display', BlinkMacSystemFont, 'Helvetica Neue', sans-serif",
      }}
    >
      {/* ambient glow */}
      <div
        style={{
          position: "absolute",
          top: "20%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "60%",
          height: "200px",
          background:
            "radial-gradient(ellipse at center, rgba(255,255,255,0.04) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "relative",
          maxWidth: "640px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "10px",
          }}
        >
          {items.map((item, i) => (
            <TechCard
              key={i}
              item={item}
              isWide={hasOdd && i === items.length - 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechnologiesGrid;
