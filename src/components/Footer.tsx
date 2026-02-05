import React from "react";
import { Github, Twitter, Instagram, MessageCircle } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Footer: React.FC = () => {
  const location = useLocation();
  const currentPage = location.pathname;

  const socialLinks = [
    { name: "Discord", icon: MessageCircle, url: "/contact", color: "#5865F2" },
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
      {/* TOP LINE */}
      <div className="border-t border-white/5" />

      {/* CONTENT */}
      <div className="mx-auto max-w-6xl px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr] gap-x-16 gap-y-10 mb-10 max-w-4xl mx-auto">
          {/* CONNECT */}
          <div>
            <h3 className="text-white font-semibold text-lg h-8 mb-6 flex items-end">
              Connect
            </h3>
            <div className="flex gap-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <Link
                    key={social.name}
                    to={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group p-3 bg-[#1a1a1a] rounded-lg border border-white/5 transition-all duration-300 hover:scale-110"
                    onMouseEnter={(e) => {
                      const icon = e.currentTarget.querySelector("svg");
                      if (icon) icon.style.color = social.color;
                    }}
                    onMouseLeave={(e) => {
                      const icon = e.currentTarget.querySelector("svg");
                      if (icon) icon.style.color = "#9CA3AF";
                    }}
                  >
                    <Icon className="w-6 h-6 text-gray-400 transition-colors duration-300" />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* NAVIGATE */}
          <div className="md:pl-14">
            <h3 className="text-white font-semibold text-lg h-8 mb-6 flex items-end">
              Navigate
            </h3>
            <nav className="flex flex-col gap-3">
              {pages.map((page) => (
                <Link
                  key={page.path}
                  to={page.path}
                  className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors duration-300 group"
                >
                  <div
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      currentPage === page.path
                        ? "bg-emerald-500 scale-100"
                        : "bg-white/20 scale-50 group-hover:scale-75 group-hover:bg-white/40"
                    }`}
                  />
                  <span className="text-sm">{page.name}</span>
                </Link>
              ))}
            </nav>
          </div>

          {/* INFO */}
          <div>
            <h3 className="text-white font-semibold text-lg h-8 mb-6 flex items-end">
              Info
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Building digital experiences
              <br />
              one project at a time.
            </p>
          </div>
        </div>

        {/* BOTTOM */}
        <div className="border-t border-white/5 pt-8">
          <p className="text-center text-gray-500 text-sm">
            {currentYear} ©{" "}
            <Link
              to="https://github.com/bastian-js"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors duration-300 font-medium"
            >
              bastian-js
            </Link>
            . All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
