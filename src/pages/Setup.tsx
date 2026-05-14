import {
  Laptop,
  Monitor,
  Keyboard,
  Mic,
  Headphones,
  Smartphone,
  Tablet,
  Code2,
  Terminal,
  Globe,
  Music,
  MessageSquare,
  Cpu,
  Server,
} from "lucide-react";

const sections = [
  {
    id: "computers",
    label: "Computers",
    color: "#60a5fa",
    icon: Cpu,
    items: [
      {
        name: 'MacBook Pro 13"',
        specs: "2019 · Intel Core i5 · macOS Sequoia",
        tag: "primary",
        icon: Laptop,
      },
      {
        name: "Windows 11 PC",
        specs: "Intel i5-10400F · 32 GB RAM · RTX 3070 Ti",
        tag: "secondary",
        icon: Monitor,
      },
      {
        name: "VServer",
        specs: "Debian GNU/Linux 12 · 6 cores · 12 GB RAM",
        tag: "server",
        icon: Server,
      },
    ],
  },
  {
    id: "displays",
    label: "Displays",
    color: "#a78bfa",
    icon: Monitor,
    items: [
      {
        name: "Triple Monitor Setup",
        specs: "3 screens on the Windows PC",
        tag: "desktop",
        icon: Monitor,
      },
    ],
  },
  {
    id: "peripherals",
    label: "Peripherals",
    color: "#f59e0b",
    icon: Keyboard,
    items: [
      {
        name: "Logitech G413 TKL SE",
        specs: "Tenkeyless mechanical keyboard",
        tag: "keyboard",
        icon: Keyboard,
      },
      {
        name: "Logitech G Pro Wireless",
        specs: "High-performance wireless gaming mouse",
        tag: "mouse",
        icon: Monitor,
      },
      {
        name: "Logitech G533 Wireless",
        specs: "Wireless gaming headset",
        tag: "headset",
        icon: Headphones,
      },
      {
        name: "FDUCE SL40",
        specs: "XLR condenser microphone",
        tag: "mic",
        icon: Mic,
      },
    ],
  },
  {
    id: "mobile",
    label: "Mobile & Audio",
    color: "#f472b6",
    icon: Smartphone,
    items: [
      {
        name: "iPhone 16",
        specs: "Daily driver",
        tag: "phone",
        icon: Smartphone,
      },
      {
        name: "AirPods Pro",
        specs: "1st gen · wireless earbuds",
        tag: "audio",
        icon: Headphones,
      },
      {
        name: "iPad (older gen)",
        specs: "Drawing & sketching with Apple Pencil 1st gen",
        tag: "tablet",
        icon: Tablet,
      },
    ],
  },
  {
    id: "desk",
    label: "Desk",
    color: "#34d399",
    icon: Monitor,
    items: [
      {
        name: "Height-Adjustable Desk",
        specs: "Sit or stand — switch between both",
        tag: "furniture",
        icon: Monitor,
      },
    ],
  },
  {
    id: "software",
    label: "Software",
    color: "#22c55e",
    icon: Code2,
    items: [
      {
        name: "VS Code",
        specs: "Dark Modern theme · Fira Code font",
        tag: "editor",
        icon: Code2,
      },
      {
        name: "Warp",
        specs: "Terminal with Dracula theme",
        tag: "terminal",
        icon: Terminal,
      },
      {
        name: "Firefox",
        specs: "Primary browser",
        tag: "browser",
        icon: Globe,
      },
      {
        name: "Figma",
        specs: "UI design & prototyping",
        tag: "design",
        icon: Monitor,
      },
      { name: "Spotify", specs: "Always running", tag: "music", icon: Music },
      {
        name: "Discord",
        specs: "Communication",
        tag: "social",
        icon: MessageSquare,
      },
    ],
  },
  {
    id: "extensions",
    label: "VS Code Extensions",
    color: "#007acc",
    icon: Code2,
    items: [
      { name: "Claude", specs: "AI coding assistant", tag: "ai", icon: Code2 },
      {
        name: "CodeSnap",
        specs: "Beautiful code screenshots",
        tag: "utility",
        icon: Code2,
      },
      {
        name: "Live Server",
        specs: "Local dev server with live reload",
        tag: "dev",
        icon: Code2,
      },
      {
        name: "Prettier",
        specs: "Code formatting",
        tag: "formatter",
        icon: Code2,
      },
      {
        name: "Remote SSH",
        specs: "Connect to remote machines",
        tag: "remote",
        icon: Code2,
      },
      {
        name: "SQLite Viewer",
        specs: "Browse SQLite databases inline",
        tag: "database",
        icon: Code2,
      },
      {
        name: "SQLTools",
        specs: "Full database management",
        tag: "database",
        icon: Code2,
      },
      {
        name: "Tailwind CSS IntelliSense",
        specs: "Class autocomplete & hover previews",
        tag: "css",
        icon: Code2,
      },
      {
        name: "Todo Tree",
        specs: "Highlights TODO/FIXME comments",
        tag: "utility",
        icon: Code2,
      },
    ],
  },
];

const totalItems = sections.reduce((sum, s) => sum + s.items.length, 0);

function SetupRow({
  name,
  specs,
  tag,
  icon: Icon,
  color,
  index,
  isLast,
}: {
  name: string;
  specs: string;
  tag: string;
  icon: React.ElementType;
  color: string;
  index: number;
  isLast: boolean;
}) {
  return (
    <div
      className="group relative flex items-center gap-0 py-4 cursor-default"
      style={{
        borderBottom: isLast ? "none" : "1px solid rgba(255,255,255,0.04)",
      }}
    >
      {/* Left accent bar */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: "2px",
          background: color,
          borderRadius: "0 2px 2px 0",
          opacity: 0,
          transform: "scaleY(0)",
          transformOrigin: "center",
          transition:
            "opacity 0.25s ease, transform 0.3s cubic-bezier(0.22,1,0.36,1)",
        }}
        className="group-hover:opacity-100 group-hover:scale-y-100"
      />

      {/* Background wash */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(90deg, ${color}07 0%, transparent 60%)`,
          opacity: 0,
          transition: "opacity 0.3s ease",
          pointerEvents: "none",
        }}
        className="group-hover:opacity-100"
      />

      {/* Number */}
      <div
        className="shrink-0 font-black font-mono tabular-nums leading-none select-none transition-colors duration-200"
        style={{
          fontSize: "10px",
          color: "rgba(255,255,255,0.15)",
          width: "clamp(36px, 5vw, 48px)",
          paddingLeft: "12px",
        }}
      >
        {String(index + 1).padStart(2, "0")}
      </div>

      {/* Icon */}
      <div
        className="shrink-0 w-7 h-7 rounded-lg flex items-center justify-center mr-3.5 ml-1.5 transition-all duration-200"
        style={{
          background: "rgba(255,255,255,0.04)",
          color: "rgba(255,255,255,0.25)",
        }}
      >
        <Icon className="w-3.5 h-3.5 transition-colors duration-200" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p
          className="font-semibold text-white text-base leading-tight transition-transform duration-300 cubic-bezier(0.22,1,0.36,1)"
          style={{ transform: "translateX(0)" }}
        >
          {name}
        </p>
        <p className="text-sm text-gray-500 mt-0.5 leading-relaxed">{specs}</p>
      </div>

      {/* Tag */}
      <span
        className="shrink-0 text-[9px] font-bold tracking-[0.15em] uppercase font-mono mr-2 sm:mr-0 transition-colors duration-200"
        style={{ color: "rgba(255,255,255,0.35)" }}
      >
        {tag}
      </span>
    </div>
  );
}

export default function Setup() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white text-left pt-28 pb-24 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-end justify-between gap-4 mb-4">
          <h1
            className="font-black tracking-tight text-white leading-none"
            style={{ fontSize: "clamp(36px, 7vw, 56px)" }}
          >
            Setup
          </h1>
          <span
            className="text-xs font-mono mb-1 shrink-0"
            style={{ color: "rgba(255,255,255,0.2)" }}
          >
            {String(totalItems).padStart(2, "0")} items
          </span>
        </div>
        <p className="text-gray-500 text-sm leading-relaxed max-w-md mb-12">
          Everything I use to build, design, and ship — hardware, software, and
          the tools in between.
        </p>

        {/* Sections */}
        <div
          className="space-y-8"
          style={{
            borderTop: "1px solid rgba(255,255,255,0.07)",
            paddingTop: "2rem",
          }}
        >
          {sections.map((section) => (
            <div key={section.id}>
              {/* Section label */}
              <div className="flex items-center gap-3 mb-1">
                <span
                  className="text-[10px] font-black tracking-[0.2em] uppercase font-mono"
                  style={{ color: section.color + "99" }}
                >
                  {section.label}
                </span>
                <div
                  className="flex-1 h-px"
                  style={{ background: "rgba(255,255,255,0.05)" }}
                />
                <span
                  className="text-[10px] font-mono"
                  style={{ color: "rgba(255,255,255,0.15)" }}
                >
                  {String(section.items.length).padStart(2, "0")}
                </span>
              </div>

              {/* Items */}
              <div>
                {section.items.map((item, i) => (
                  <SetupRow
                    key={item.name}
                    name={item.name}
                    specs={item.specs}
                    tag={item.tag}
                    icon={item.icon}
                    color={section.color}
                    index={i}
                    isLast={i === section.items.length - 1}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
