import React from "react";
import { GitBranch, MessageCircle, Camera, MessageSquare } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Footer: React.FC = () => {
  const location = useLocation();
  const currentPage = location.pathname;

  const socialLinks = [
    { name: "Discord", icon: MessageCircle, url: "/contact", color: "#5865F2" },
    { name: "Twitter", icon: MessageSquare, url: "https://x.com/knuddelghg", color: "#1DA1F2" },
    { name: "Instagram", icon: Camera, url: "https://www.instagram.com/bbastiann._/", color: "#E4405F" },
    { name: "GitHub", icon: GitBranch, url: "https://github.com/bastian-js", color: "#FFFFFF" },
  ];

  const pages = [
    { name: "Home", path: "/" },
    { name: "Projects", path: "/projects" },
    { name: "Socials", path: "/socials" },
    { name: "About", path: "/about" },
  ];

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0a0a0a] w-full">
      <div className="border-t border-white/5" />

      <div className="mx-auto max-w-5xl px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">

          {/* Brand */}
          <div className="flex flex-col gap-3">
            <span className="text-white font-bold text-base tracking-tight">bastian-js</span>
            <p className="text-sm text-gray-600 leading-relaxed max-w-[200px]">
              Building digital experiences one project at a time.
            </p>
          </div>

          {/* Navigate */}
          <div>
            <h3 className="text-[10px] font-bold tracking-[0.18em] text-gray-600 uppercase mb-4">
              Navigate
            </h3>
            <nav className="flex flex-col gap-2.5">
              {pages.map((page) => (
                <Link
                  key={page.path}
                  to={page.path}
                  className="flex items-center gap-2.5 text-sm text-gray-500 hover:text-white transition-colors duration-200 group w-fit"
                >
                  <div
                    className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
                      currentPage === page.path
                        ? "bg-emerald-400"
                        : "bg-white/15 group-hover:bg-white/40"
                    }`}
                  />
                  {page.name}
                </Link>
              ))}
              {/* Noury */}
              <Link
                to="/noury"
                className="flex items-center gap-2.5 text-sm text-gray-500 hover:text-white transition-colors duration-200 group w-fit"
              >
                <div
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
                    currentPage === "/noury"
                      ? "bg-emerald-400"
                      : "bg-white/15 group-hover:bg-white/40"
                  }`}
                />
                Noury
                <span className="rounded-full bg-emerald-400/15 border border-emerald-300/25 px-1.5 py-0.5 text-[9px] font-bold tracking-wide text-emerald-400 uppercase leading-none">
                  Soon
                </span>
              </Link>
              {/* PiggyTrack */}
              <Link
                to="/piggytrack"
                className="flex items-center gap-2.5 text-sm text-gray-500 hover:text-white transition-colors duration-200 group w-fit"
              >
                <div
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
                    currentPage === "/piggytrack"
                      ? "bg-[#FF2E8C]"
                      : "bg-white/15 group-hover:bg-white/40"
                  }`}
                />
                PiggyTrack
                <span className="rounded-full bg-pink-500/15 border border-pink-400/25 px-1.5 py-0.5 text-[9px] font-bold tracking-wide text-pink-400 uppercase leading-none">
                  Live
                </span>
              </Link>
            </nav>
          </div>

          {/* Connect */}
          <div>
            <h3 className="text-[10px] font-bold tracking-[0.18em] text-gray-600 uppercase mb-4">
              Connect
            </h3>
            <div className="flex gap-2.5">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <Link
                    key={social.name}
                    to={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={social.name}
                    className="p-2.5 rounded-lg border border-white/8 bg-white/3 hover:border-white/15 hover:bg-white/8 transition-all duration-200 group"
                    onMouseEnter={(e) => {
                      const icon = e.currentTarget.querySelector("svg");
                      if (icon) icon.style.color = social.color;
                    }}
                    onMouseLeave={(e) => {
                      const icon = e.currentTarget.querySelector("svg");
                      if (icon) icon.style.color = "#6B7280";
                    }}
                  >
                    <Icon className="w-4 h-4 text-gray-500 transition-colors duration-200" />
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-sm text-gray-600">
            {currentYear} &copy;{" "}
            <a
              href="https://github.com/bastian-js"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-white transition-colors duration-200 font-medium"
            >
              bastian-js
            </a>
            <span className="ml-2 text-gray-700">· All rights reserved.</span>
          </p>
          <Link
            to="/privacy"
            className="text-xs text-gray-600 hover:text-gray-400 transition-colors duration-200"
          >
            Privacy Policy
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
