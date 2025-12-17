import React from "react";
import { Github, Twitter, Instagram, MessageCircle } from "lucide-react";

interface FooterProps {
  currentPage?: string;
}

const Footer: React.FC<FooterProps> = ({ currentPage = "home" }) => {
  const socialLinks = [
    {
      name: "Discord",
      icon: MessageCircle,
      url: "#",
      color: "#5865F2",
    },
    {
      name: "Twitter",
      icon: Twitter,
      url: "#",
      color: "#1DA1F2",
    },
    {
      name: "Instagram",
      icon: Instagram,
      url: "#",
      color: "#E4405F",
    },
    {
      name: "GitHub",
      icon: Github,
      url: "#",
      color: "#FFFFFF",
    },
  ];

  const pages = [
    { name: "Home", path: "home" },
    { name: "Projects", path: "projects" },
    { name: "About", path: "about" },
    { name: "Contact", path: "contact" },
  ];

  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-[#0a0a0a] border-t border-white/5 mt-20">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-8">
          {/* Social Media Links */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-white font-semibold mb-3 text-lg">Connect</h3>
            <div className="flex gap-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative p-3 bg-[#1a1a1a] rounded-lg border border-white/5 transition-all duration-300 hover:scale-110"
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
                  </a>
                );
              })}
            </div>
          </div>

          {/* Navigation Pages */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-white font-semibold mb-3 text-lg">Navigate</h3>
            <nav className="flex flex-col gap-3">
              {pages.map((page) => (
                <a
                  key={page.path}
                  href={`#${page.path}`}
                  className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors duration-300 group"
                >
                  <div
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      currentPage === page.path
                        ? "bg-emerald-500"
                        : "bg-transparent group-hover:bg-white/20"
                    }`}
                  />
                  <span className="text-sm">{page.name}</span>
                </a>
              ))}
            </nav>
          </div>

          {/* Additional Info */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-white font-semibold mb-3 text-lg">Info</h3>
            <p className="text-gray-400 !text-sm leading-relaxed text-left">
              Building digital experiences
              <br />
              one project at a time.
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-white/5">
          <p className="text-center text-gray-500 !text-sm">
            {currentYear}
            {" ©  "}
            <a
              href="https://github.com/bastian-js"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors duration-300 font-medium"
            >
              bastian-js
            </a>
            . All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
