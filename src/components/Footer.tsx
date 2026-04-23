import React from "react";
import { Github, MessageCircle, Instagram, Twitter } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Footer: React.FC = () => {
  const location = useLocation();
  const currentPage = location.pathname;

  const socialLinks = [
    { name: "Contact", icon: MessageCircle, url: "/contact", color: "#5865F2" },
    {
      name: "Twitter",
      icon: Twitter,
      url: "https://x.com/knuddelghg",
      color: "#1DA1F2",
    },
    {
      name: "Instagram",
      icon: Instagram,
      url: "https://www.instagram.com/bbastiann._/",
      color: "#E4405F",
    },
    {
      name: "GitHub",
      icon: Github,
      url: "https://github.com/bastian-js",
      color: "#FFFFFF",
    },
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
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
            </nav>
          </div>

          {/* Projects */}
          <div>
            <h3 className="text-[10px] font-bold tracking-[0.18em] text-gray-600 uppercase mb-4">
              Projects
            </h3>
            <nav className="flex flex-col gap-2.5">
              {/* Noury */}
              <Link
                to="/noury"
                className="flex items-center gap-2.5 text-sm text-gray-500 hover:text-white transition-colors duration-200 group w-fit"
              >
                <div
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${currentPage === "/noury" ? "bg-emerald-400" : "bg-white/15 group-hover:bg-white/40"}`}
                />
                Noury
                <span className="rounded-full bg-emerald-400/15 border border-emerald-300/25 px-1.5 py-0.5 text-[9px] font-bold tracking-wide text-emerald-400 uppercase leading-none">
                  Soon
                </span>
              </Link>
              {/* DropNote */}
              <Link
                to="/dropnote"
                className="flex items-center gap-2.5 text-sm text-gray-500 hover:text-white transition-colors duration-200 group w-fit"
              >
                <div
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${currentPage === "/dropnote" ? "bg-[#3994E7]" : "bg-white/15 group-hover:bg-white/40"}`}
                />
                DropNote
              </Link>
              {/* PiggyTrack */}
              <Link
                to="/piggytrack"
                className="flex items-center gap-2.5 text-sm text-gray-500 hover:text-white transition-colors duration-200 group w-fit"
              >
                <div
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${currentPage === "/piggytrack" ? "bg-[#FF2E8C]" : "bg-white/15 group-hover:bg-white/40"}`}
                />
                PiggyTrack
              </Link>
              {/* ProPerform */}
              <Link
                to="/properform"
                className="flex items-center gap-2.5 text-sm text-gray-500 hover:text-white transition-colors duration-200 group w-fit"
              >
                <div
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${currentPage === "/properform" ? "bg-[#1F3A8A]" : "bg-white/15 group-hover:bg-white/40"}`}
                />
                ProPerform
                <span
                  className="rounded-full border border-blue-700/25 px-1.5 py-0.5 text-[9px] font-bold tracking-wide text-blue-400 uppercase leading-none"
                  style={{ background: "#1F3A8A30" }}
                >
                  Soon
                </span>
              </Link>
            </nav>
          </div>

          {/* Spotify */}
          <div>
            <h3 className="text-[10px] font-bold tracking-[0.18em] text-gray-600 uppercase mb-4">
              Spotify
            </h3>
            <nav className="flex flex-col gap-2.5">
              <Link
                to="/spotify/stats"
                className="flex items-center gap-2.5 text-sm text-gray-500 hover:text-white transition-colors duration-200 group w-fit"
              >
                <div
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${currentPage === "/spotify/stats" ? "bg-[#1DB954]" : "bg-white/15 group-hover:bg-white/40"}`}
                />
                Top Tracks
              </Link>
              <Link
                to="/spotify/hall-of-fame"
                className="flex items-center gap-2.5 text-sm text-gray-500 hover:text-white transition-colors duration-200 group w-fit"
              >
                <div
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${currentPage === "/spotify/hall-of-fame" ? "bg-[#1DB954]" : "bg-white/15 group-hover:bg-white/40"}`}
                />
                Songs
              </Link>
              <Link
                to="/spotify/artist-hall-of-fame"
                className="flex items-center gap-2.5 text-sm text-gray-500 hover:text-white transition-colors duration-200 group w-fit"
              >
                <div
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${currentPage === "/spotify/artist-hall-of-fame" ? "bg-[#1DB954]" : "bg-white/15 group-hover:bg-white/40"}`}
                />
                Artists
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
