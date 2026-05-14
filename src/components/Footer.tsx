import React from "react";
import { Github, MessageCircle, Instagram, Twitter } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import MagneticWrapper from "./MagneticWrapper";

const NAV_LINKS = [
  { label: "Home",     path: "/" },
  { label: "Projects", path: "/projects" },
  { label: "About",    path: "/about" },
  { label: "Socials",  path: "/socials" },
  { label: "Contact",  path: "/contact" },
  { label: "Now",      path: "/now" },
  { label: "Setup",    path: "/setup" },
];

const LEGAL_LINKS = [
  { label: "Privacy Policy", path: "/privacy" },
  { label: "Terms of Use",   path: "/terms" },
];

const SOCIALS = [
  { name: "GitHub",    Icon: Github,         url: "https://github.com/bastian-js",              color: "#ffffff" },
  { name: "Twitter",   Icon: Twitter,        url: "https://x.com/knuddelghg",                   color: "#1DA1F2" },
  { name: "Instagram", Icon: Instagram,      url: "https://www.instagram.com/bbastiann._/",     color: "#E4405F" },
  { name: "Contact",   Icon: MessageCircle,  url: "/contact",                                   color: "#5865F2" },
];

const Footer: React.FC = () => {
  const { pathname } = useLocation();
  const year = new Date().getFullYear();

  return (
    <footer
      style={{
        background: "#0c0c0c",
        borderTop: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      {/* ── Identity band ─────────────────────────────────────── */}
      <div
        className="mx-auto max-w-5xl px-6 pt-12 pb-8 flex flex-col sm:flex-row sm:items-end gap-6 sm:gap-0 sm:justify-between"
      >
        {/* Left: Name + tagline */}
        <div>
          <p
            className="font-black tracking-tight text-white leading-none mb-1.5"
            style={{ fontSize: "clamp(28px, 5vw, 38px)" }}
          >
            bastian-js
          </p>
          <p
            className="text-xs font-medium tracking-[0.14em] uppercase"
            style={{ color: "rgba(255,255,255,0.2)" }}
          >
            developer · student · austria
          </p>
        </div>

        {/* Right: Status dot */}
        <div className="flex items-center gap-2">
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{
              background: "#34d399",
              boxShadow: "0 0 6px 2px #34d39960",
              animation: "pulse 2.4s cubic-bezier(0.4,0,0.6,1) infinite",
            }}
          />
          <span
            className="text-xs font-mono"
            style={{ color: "rgba(255,255,255,0.25)" }}
          >
            online
          </span>
        </div>
      </div>

      {/* ── Navigation strip ──────────────────────────────────── */}
      <div
        className="mx-auto max-w-5xl px-6"
        style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
      >
        <div className="flex flex-wrap gap-0">
          {NAV_LINKS.map(({ label, path }, i) => (
            <Link
              key={path}
              to={path}
              className="group flex items-center gap-3 py-4 pr-8 transition-colors duration-150"
              style={{ color: pathname === path ? "#fff" : "rgba(255,255,255,0.3)" }}
            >
              <span
                className="font-mono text-[10px] shrink-0 transition-colors duration-150"
                style={{
                  color: pathname === path ? "#34d399" : "rgba(255,255,255,0.12)",
                }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <span
                className="text-sm font-medium group-hover:text-white transition-colors duration-150"
              >
                {label}
              </span>
              {i < NAV_LINKS.length - 1 && (
                <span
                  className="shrink-0 ml-auto mr-0 hidden sm:block"
                  style={{
                    width: "1px",
                    height: "14px",
                    background: "rgba(255,255,255,0.06)",
                    marginRight: "-8px",
                  }}
                />
              )}
            </Link>
          ))}
        </div>
      </div>

      {/* ── Bottom bar ────────────────────────────────────────── */}
      <div
        className="mx-auto max-w-5xl px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
      >
        {/* Socials */}
        <div className="flex items-center gap-2">
          {SOCIALS.map(({ name, Icon, url, color }) => {
            const isExternal = url.startsWith("http");
            const inner = (
              <MagneticWrapper strength={0.5}>
                <span
                  className="flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-150"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    color: "rgba(255,255,255,0.35)",
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.color = color;
                    el.style.borderColor = color + "40";
                    el.style.background = color + "10";
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.color = "rgba(255,255,255,0.35)";
                    el.style.borderColor = "rgba(255,255,255,0.07)";
                    el.style.background = "rgba(255,255,255,0.04)";
                  }}
                >
                  <Icon className="w-3.5 h-3.5" />
                </span>
              </MagneticWrapper>
            );

            return isExternal ? (
              <a
                key={name}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                title={name}
                style={{ display: "inline-block" }}
              >
                {inner}
              </a>
            ) : (
              <Link key={name} to={url} title={name} style={{ display: "inline-block" }}>
                {inner}
              </Link>
            );
          })}
        </div>

        {/* Copyright + Legal */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
          <p
            className="text-xs font-mono"
            style={{ color: "rgba(255,255,255,0.2)" }}
          >
            © {year} bastian-js
          </p>
          <span style={{ color: "rgba(255,255,255,0.08)", fontSize: "10px" }}>|</span>
          {LEGAL_LINKS.map(({ label, path }) => (
            <Link
              key={path}
              to={path}
              className="text-xs transition-colors duration-150"
              style={{ color: "rgba(255,255,255,0.2)" }}
              onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "rgba(255,255,255,0.5)")}
              onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "rgba(255,255,255,0.2)")}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </footer>
  );
};

export default Footer;
