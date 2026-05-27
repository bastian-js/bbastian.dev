import {
  Mail,
  Music,
  ArrowUpRight,
  Github,
  Instagram,
  Twitter,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

const socialLinks = [
  {
    name: "GitHub",
    username: "@bastian-js",
    description: "Code & open-source projects",
    url: "https://github.com/bastian-js",
    icon: Github,
    color: "#e5e7eb",
    external: true,
  },
  {
    name: "Instagram",
    username: "@bbastiann._",
    description: "Follow my journey",
    url: "https://www.instagram.com/bbastiann._/",
    icon: Instagram,
    color: "#f472b6",
    external: true,
  },
  {
    name: "Twitter",
    username: "@knuddelghg",
    description: "Thoughts & updates",
    url: "https://x.com/knuddelghg",
    icon: Twitter,
    color: "#e5e7eb",
    external: true,
  },
  {
    name: "Spotify",
    username: "bastian",
    description: "Listen to my playlists",
    url: "https://open.spotify.com/user/4tpe4kf93p0xdnoqx82ihrkwa?si=0c1e73e841ed47a9",
    icon: Music,
    color: "#1DB954",
    external: true,
  },
  {
    name: "Email",
    username: "hello@bbastian.dev",
    description: "Send me a message",
    url: "/contact",
    icon: Mail,
    color: "#34d399",
    external: false,
  },
];

function SocialRow({
  item,
  index,
}: {
  item: (typeof socialLinks)[0];
  index: number;
}) {
  const [hovered, setHovered] = useState(false);
  const {
    name,
    username,
    description,
    url,
    icon: Icon,
    color,
    external,
  } = item;
  const num = String(index + 1).padStart(2, "0");

  const inner = (
    <div
      className="relative flex items-center gap-0 py-5"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderBottom:
          index < socialLinks.length - 1
            ? "1px solid rgba(255,255,255,0.05)"
            : "none",
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
          opacity: hovered ? 1 : 0,
          transform: hovered ? "scaleY(1)" : "scaleY(0)",
          transition:
            "opacity 0.25s ease, transform 0.3s cubic-bezier(0.22,1,0.36,1)",
          transformOrigin: "center",
          boxShadow: `0 0 12px 2px ${color}60`,
        }}
      />

      {/* Background wash */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(90deg, ${color}08 0%, transparent 60%)`,
          opacity: hovered ? 1 : 0,
          transition: "opacity 0.3s ease",
          pointerEvents: "none",
        }}
      />

      {/* Number */}
      <div
        className="shrink-0 font-black font-mono tabular-nums leading-none select-none"
        style={{
          fontSize: "11px",
          color: hovered ? color : "rgba(255,255,255,0.18)",
          width: "clamp(36px, 5vw, 56px)",
          transition: "color 0.25s ease",
          paddingLeft: "12px",
        }}
      >
        {num}
      </div>

      {/* Icon */}
      <div
        className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center mr-4 ml-2 transition-all duration-200"
        style={{
          background: hovered ? color + "20" : "rgba(255,255,255,0.05)",
          color: hovered ? color : "rgba(255,255,255,0.3)",
        }}
      >
        <Icon className="w-3.5 h-3.5" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2 mb-0.5">
          <span
            className="font-bold text-white leading-tight"
            style={{
              fontSize: "clamp(15px, 2.5vw, 18px)",
              transform: hovered ? "translateX(4px)" : "translateX(0)",
              transition: "transform 0.3s cubic-bezier(0.22,1,0.36,1)",
              display: "inline-block",
            }}
          >
            {name}
          </span>
          <span className="text-xs font-mono text-gray-600">{username}</span>
        </div>
        <p
          className="text-xs text-gray-500"
          style={{
            opacity: hovered ? 1 : 0.6,
            transition: "opacity 0.25s ease",
          }}
        >
          {description}
        </p>
      </div>

      {/* Arrow */}
      <ArrowUpRight
        className="w-4 h-4 shrink-0 mr-2 sm:mr-4 transition-all duration-200"
        style={{
          color: hovered ? color : "rgba(255,255,255,0.15)",
          transform: hovered ? "translate(2px, -2px)" : "translate(0,0)",
        }}
      />
    </div>
  );

  return external ? (
    <a href={url} target="_blank" rel="noopener noreferrer" className="block">
      {inner}
    </a>
  ) : (
    <Link to={url} className="block">
      {inner}
    </Link>
  );
}

function Socials() {
  const date = new Date();
  const isShown = date.getMonth() === 5;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white text-left pt-28 pb-24 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-end justify-between gap-4 mb-4">
          <h1
            className="font-black tracking-tight text-white leading-none"
            style={{ fontSize: "clamp(36px, 7vw, 56px)" }}
          >
            Socials
          </h1>
          <span
            className="text-xs font-mono mb-1 shrink-0"
            style={{ color: "rgba(255,255,255,0.2)" }}
          >
            {String(socialLinks.length).padStart(2, "0")} links
          </span>
        </div>
        <p className="text-gray-500 text-sm leading-relaxed max-w-md mb-12">
          Building cool stuff with code. Connect with me below.
        </p>

        {isShown && (
          <Link
            to="https://link.bbastian.dev"
            className="block mx-auto max-w-6xl px-4 pt-6 group mb-12"
          >
            <div className="relative overflow-hidden rounded-2xl border border-sky-300/25 bg-linear-to-br from-[#111a1f] via-[#101010] to-[#0c1013] px-5 py-4 transition-colors duration-200 group-hover:border-sky-300/50">
              <div className="pointer-events-none absolute -top-10 -right-8 h-32 w-32 rounded-full bg-sky-400/20 blur-3xl" />
              <div className="relative flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <div className="flex items-center gap-3 shrink-0">
                  <span className="inline-flex items-center gap-2 rounded-full border border-sky-300/40 bg-sky-300/15 px-3 py-0.5 text-xs font-bold tracking-[0.18em] text-sky-100 uppercase shadow-[0_0_16px_rgba(56,189,248,0.2)]">
                    <span className="h-1.5 w-1.5 rounded-full bg-sky-300" />
                    Out Now
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-lg font-black text-white">
                      link.bbastian.dev
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-3 sm:flex-1 min-w-0">
                  <p className="text-sm text-gray-400 min-w-0">
                    URL shortener — manage and share your links in one place.
                  </p>
                  <span className="text-xs text-sky-300 font-semibold group-hover:underline shrink-0">
                    Check out →
                  </span>
                </div>
              </div>
            </div>
          </Link>
        )}

        {/* List */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
          {socialLinks.map((item, i) => (
            <SocialRow key={item.name} item={item} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Socials;
