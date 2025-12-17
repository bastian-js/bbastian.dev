import React, { useState } from "react";
import {
  Github,
  Linkedin,
  Mail,
  Instagram,
  Twitter,
  Globe,
  Music,
  MessageCircle,
  Code,
} from "lucide-react";

function Socials() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const socialLinks = [
    {
      name: "GitHub",
      username: "@bastian-js",
      description: "Check out my code & projects",
      url: "https://github.com/bastian-js",
      icon: Github,
      color: "from-gray-700 to-gray-900",
      hoverColor: "hover:shadow-gray-500/20",
    },
    {
      name: "Instagram",
      username: "@bbastiann._",
      description: "Follow my journey",
      url: "https://www.instagram.com/bbastiann._/",
      icon: Instagram,
      color: "from-pink-500 via-red-500 to-yellow-500",
      hoverColor: "hover:shadow-pink-500/30",
    },
    {
      name: "Twitter",
      username: "@bbastian",
      description: "Thoughts & updates",
      url: "https://x.com/knuddelghg",
      icon: Twitter,
      color: "from-gray-800 to-black",
      hoverColor: "hover:shadow-gray-500/20",
    },
    {
      name: "Spotify",
      username: "bastian",
      description: "Listen to my playlists",
      url: "https://open.spotify.com/user/4tpe4kf93p0xdnoqx82ihrkwa?si=0c1e73e841ed47a9",
      icon: Music,
      color: "from-green-500 to-green-700",
      hoverColor: "hover:shadow-green-500/30",
    },
    {
      name: "Portfolio",
      username: "bbastian.dev",
      description: "Visit my main website",
      url: "/",
      icon: Globe,
      color: "from-cyan-500 to-blue-600",
      hoverColor: "hover:shadow-cyan-500/30",
    },
    {
      name: "Email",
      username: "contact@bbastian.dev",
      description: "Send me a message",
      url: "mailto:contact@bbastian.dev",
      icon: Mail,
      color: "from-orange-500 to-red-600",
      hoverColor: "hover:shadow-orange-500/30",
    },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white py-20 px-6">
      {/* Header Section */}
      <div className="max-w-2xl mx-auto text-center mb-12">
        <div className="mb-6 inline-block">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 p-1 mx-auto">
            <img
              src="/profile_picture.png"
              alt="Profile"
              className="w-full h-full rounded-full object-cover border-4 border-[#0a0a0a]"
              onError={(e) => {
                e.currentTarget.style.display = "none";
                e.currentTarget.parentElement!.innerHTML =
                  '<div class="w-full h-full rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-3xl font-bold">B</div>';
              }}
            />
          </div>
        </div>

        <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
          Bastian
        </h1>

        <p className="text-gray-400 text-lg mb-2">Full-Stack Developer</p>

        <p className="text-gray-500 max-w-md mx-auto">
          Building cool stuff with code. Connect with me on your favorite
          platform below.
        </p>
      </div>

      {/* Social Links Grid */}
      <div className="max-w-2xl mx-auto space-y-4">
        {socialLinks.map((link, index) => {
          const Icon = link.icon;
          return (
            <a
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className={`
                group relative block w-full p-6 rounded-2xl
                bg-[#1a1a1a] border border-white/5
                transition-all duration-300 ease-out
                hover:scale-[1.02] hover:border-white/10
                hover:shadow-2xl ${link.hoverColor}
                active:scale-[0.98]
              `}
            >
              {/* Gradient overlay on hover */}
              <div
                className={`
                  absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-10
                  bg-gradient-to-r ${link.color}
                  transition-opacity duration-300
                `}
              />

              <div className="relative flex items-center gap-5">
                {/* Icon */}
                <div
                  className={`
                    flex-shrink-0 w-14 h-14 rounded-xl
                    bg-gradient-to-br ${link.color}
                    flex items-center justify-center
                    transition-transform duration-300
                    ${
                      hoveredIndex === index
                        ? "scale-110 rotate-3"
                        : "scale-100"
                    }
                    shadow-lg
                  `}
                >
                  <Icon className="w-7 h-7 text-white" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-xl font-semibold text-white">
                      {link.name}
                    </h3>
                    <span className="text-sm text-gray-500">
                      {link.username}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm text-left">
                    {link.description}
                  </p>
                </div>

                {/* Arrow */}
                <div
                  className={`
                    flex-shrink-0 text-gray-400 transition-all duration-300
                    ${hoveredIndex === index ? "translate-x-1 text-white" : ""}
                  `}
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </a>
          );
        })}
      </div>

      {/* Footer */}
      <div className="max-w-2xl mx-auto mt-16 text-center">
        <p className="text-gray-500 text-sm">Made with 💙 by Bastian</p>
        <p className="text-gray-600 text-xs mt-2">
          © 2024 bbastian.dev - All rights reserved
        </p>
      </div>
    </div>
  );
}

export default Socials;
