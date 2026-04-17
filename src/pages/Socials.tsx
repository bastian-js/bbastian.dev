import {
  Mail,
  Music,
  ArrowUpRight,
  Github,
  Instagram,
  Twitter,
} from "lucide-react";

import { Link } from "react-router-dom";

const socialLinks = [
  {
    name: "GitHub",
    username: "@bastian-js",
    description: "Check out my code & projects",
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

function Socials() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center py-24 px-4">
      {/* Header */}
      <div className="w-full max-w-lg mb-10 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-white mb-3">
          Socials
        </h1>
        <p className="text-gray-500 text-sm">
          Building cool stuff with code. Connect with me below.
        </p>
      </div>

      {/* Cards */}
      <div className="w-full max-w-lg flex flex-col gap-2.5">
        {socialLinks.map(
          ({
            name,
            username,
            description,
            url,
            icon: Icon,
            color,
            external,
          }) => {
            const content = (
              <div className="flex items-center gap-4 px-5 py-4 bg-[#111] border border-white/6 rounded-2xl hover:border-white/12 hover:bg-white/3 transition-all duration-150 group cursor-pointer">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: color + "18", color }}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-m font-semibold text-white">
                      {name}
                    </span>
                    <span className="text-sm text-gray-600 font-mono">
                      {username}
                    </span>
                  </div>
                  <p className="text-sm text-left text-gray-500 mt-0.5">
                    {description}
                  </p>
                </div>
                <ArrowUpRight className="w-4 h-4 text-gray-700 group-hover:text-gray-400 transition-colors shrink-0" />
              </div>
            );

            return external ? (
              <a
                key={name}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {content}
              </a>
            ) : (
              <Link key={name} to={url}>
                {content}
              </Link>
            );
          },
        )}
      </div>
    </div>
  );
}

export default Socials;
