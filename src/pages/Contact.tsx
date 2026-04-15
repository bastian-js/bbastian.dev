import React, { useState, useEffect, useRef } from "react";
import { Send, Mail, User, MessageSquare, Check } from "lucide-react";

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

function Contact() {
  const header = useReveal();
  const form = useReveal();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [, setShowCheckmark] = useState(false);

  const contactTexts = [
    "Let's start a project",
    "Contact me",
    "Let's connect",
    "Work with me",
    "Start a collaboration",
    "Get in touch",
    "Reach out",
    "Let's talk",
  ];

  // Set random text only once on component mount
  const [randomText] = useState(
    () => contactTexts[Math.floor(Math.random() * contactTexts.length)],
  );

  // Auto-reset success message after 4 seconds
  useEffect(() => {
    if (status === "success") {
      const timer = setTimeout(() => {
        setStatus("idle");
        setShowCheckmark(false);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");
    setShowCheckmark(false);

    try {
      if (formData.message.length < 10) {
        throw new Error("Message must be at least 10 characters long");
      }

      const res = await fetch("https://api.bbastian.dev/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setStatus("success");
      setShowCheckmark(true);
      setFormData({ name: "", email: "", message: "" });
    } catch (err: any) {
      setStatus("error");
      setErrorMessage(err.message);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

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
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-600 p-[3px]">
              <img
                src="/profile_picture.png"
                alt="Profile"
                className="profile-pic w-full h-full rounded-full object-cover border-4 border-[#0a0a0a]"
              />
            </div>
          </div>

          <h1 className="text-3xl font-bold mb-3 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Contact
          </h1>

          <p className="text-gray-400 text-base">{randomText}</p>
        </div>

        {/* Form */}
        <div
          ref={form.ref}
          className={`max-w-2xl mx-auto space-y-4 transition-all duration-1000 ${
            form.visible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
          }`}
        >
          {/* Input Card */}
          {[
            {
              id: "name",
              placeholder: "Your Name",
              icon: User,
              type: "text",
            },
            {
              id: "email",
              placeholder: "Your Email",
              icon: Mail,
              type: "email",
            },
          ].map(({ id, placeholder, icon: Icon, type }) => (
            <div
              key={id}
              className="
                relative w-full
                bg-[#1a1a1a] border border-white/5
                rounded-2xl px-6 py-6
                transition-all duration-300
                hover:border-white/10 hover:bg-[#222222]
              "
            >
              <Icon className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
              <input
                id={id}
                type={type}
                value={(formData as any)[id]}
                onChange={handleChange}
                placeholder={placeholder}
                className="
                  w-full bg-transparent
                  pl-12 pr-4
                  text-lg text-white
                  placeholder-gray-500
                  outline-none
                "
              />
            </div>
          ))}

          {/* Message */}
          <div className="relative bg-[#1a1a1a] border border-white/5 rounded-2xl px-6 py-6 transition-all duration-300 hover:border-white/10 hover:bg-[#222222]">
            <MessageSquare className="absolute left-6 top-6 text-gray-500 w-5 h-5" />
            <textarea
              id="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Your Message"
              className="
                w-full bg-transparent
                pl-12 pr-4
                text-lg text-white
                placeholder-gray-500
                outline-none
                min-h-[140px]
              "
            />
          </div>

          {/* Status Messages */}
          {status === "success" && (
            <div className="success-message rounded-2xl border border-green-500/30 bg-green-500/10 px-6 py-4 flex items-center gap-3">
              <div className="flex-shrink-0">
                <Check
                  className="checkmark-icon w-6 h-6 text-green-400"
                  strokeWidth={3}
                />
              </div>
              <span className="text-green-400 font-semibold">
                Message sent successfully! 🚀
              </span>
            </div>
          )}

          {status === "error" && (
            <div className="success-message rounded-2xl border border-red-500/30 bg-red-500/10 px-6 py-4 text-red-400">
              {errorMessage}
            </div>
          )}

          {/* Button */}
          <button
            onClick={handleSubmit}
            disabled={status === "loading"}
            className={`
              w-full rounded-2xl px-6 py-6
              bg-gradient-to-r from-green-500 to-green-600
              text-lg font-semibold
              transition-all duration-300
              hover:scale-[1.02] hover:shadow-lg hover:shadow-green-500/50
              disabled:opacity-60 disabled:cursor-not-allowed
              cursor-pointer
              ${status === "success" ? "pulsing" : ""}
            `}
          >
            <span className="flex items-center justify-center gap-3">
              {status === "loading" ? (
                <>
                  <span>Sending…</span>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                </>
              ) : status === "success" ? (
                <>
                  <Check className="w-5 h-5" />
                  <span>Message Sent!</span>
                </>
              ) : (
                <>
                  <span>Send Message</span>
                  <Send className="w-5 h-5" />
                </>
              )}
            </span>
          </button>
        </div>
      </div>
    </>
  );
}

export default Contact;
