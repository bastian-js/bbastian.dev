import { useState, useEffect, useRef } from "react";
import { Github, Mail, Instagram, Twitter, Globe, Music } from "lucide-react";
import { Link } from "react-router-dom";

const useReveal = () => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setVisible(true),
      { threshold: 0.15 },
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return { ref, visible };
};

function Socials() {
  const header = useReveal();
  const cards = useReveal();
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
      url: "/contact",
      icon: Mail,
      color: "from-orange-500 to-red-600",
      hoverColor: "hover:shadow-orange-500/30",
    },
  ];

  return (
    <>
      <style>{`
        @keyframes glowPulse {
          0%, 100% {
            box-shadow: 0 0 20px rgba(34, 211, 238, 0.3), 0 0 40px rgba(59, 130, 246, 0.2);
          }
          50% {
            box-shadow: 0 0 30px rgba(34, 211, 238, 0.5), 0 0 60px rgba(59, 130, 246, 0.4);
          }
        }

        @keyframes checkmarkBounce {
          0% {
            transform: scale(0) rotate(-45deg);
            opacity: 0;
          }
          50% {
            transform: scale(1.15) rotate(10deg);
          }
          100% {
            transform: scale(1) rotate(0deg);
            opacity: 1;
          }
        }

        @keyframes successSlideIn {
          0% {
            transform: translateY(-20px);
            opacity: 0;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes successSlideOut {
          0% {
            transform: translateY(0);
            opacity: 1;
          }
          100% {
            transform: translateY(20px);
            opacity: 0;
          }
        }

        @keyframes pulseGreen {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }

        .profile-pic {
          transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .profile-container:hover .profile-pic {
          transform: scale(1.08);
        }

        .profile-container:hover {
          animation: glowPulse 2s ease-in-out infinite;
        }

        .checkmark-icon {
          animation: checkmarkBounce 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
        }

        .success-message {
          animation: successSlideIn 0.5s ease-out forwards;
        }

        .success-message.exit {
          animation: successSlideOut 0.5s ease-in forwards;
        }

        .pulsing {
          animation: pulseGreen 1.5s ease-in-out infinite;
        }
      `}</style>
      <div className="min-h-screen bg-[#0a0a0a] text-white py-20 px-6">
        {/* Header */}
        <div
          ref={header.ref}
          className={`max-w-2xl mx-auto text-center mb-14 transition-all duration-1000 ${
            header.visible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
          }`}
        >
          <div className="mb-6">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-amber-400 to-orange-600 p-[3px]">
              <img
                src="/profile_picture.png"
                alt="Profile"
                className="profile-pic w-full h-full rounded-full object-cover border-4 border-[#0a0a0a]"
              />
            </div>
          </div>

          <h1 className="text-3xl font-bold mb-3 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Socials
          </h1>

          <p className="text-gray-400 text-base">
            Building cool stuff with code. Connect with me below.
          </p>
        </div>

        {/* Cards */}
        <div
          ref={cards.ref}
          className={`max-w-2xl mx-auto space-y-4 transition-all duration-1000 ${
            cards.visible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
          }`}
        >
          {socialLinks.map((link, index) => {
            const Icon = link.icon;

            return (
              <Link
                key={index}
                to={link.url}
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="
                  relative group block w-full
                  bg-[#1a1a1a] border border-white/5
                  rounded-2xl px-6 py-6
                  transition-all duration-300
                  hover:scale-[1.02] hover:border-white/10
                "
              >
                <div
                  className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-10 bg-gradient-to-r ${link.color}`}
                />

                <div className="relative flex items-center gap-5">
                  <div
                    className={`
                      w-14 h-14 rounded-xl
                      bg-gradient-to-br ${link.color}
                      flex items-center justify-center
                      transition-transform
                      ${hoveredIndex === index ? "scale-110 rotate-6" : ""}
                    `}
                  >
                    <Icon className="w-7 h-7 text-white" />
                  </div>

                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">{link.name}</h3>
                    <p className="text-sm text-gray-400">{link.description}</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default Socials;
