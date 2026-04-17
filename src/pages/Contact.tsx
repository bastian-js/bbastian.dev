import React, { useState, useEffect, useRef } from "react";
import {
  Send,
  Mail,
  User,
  MessageSquare,
  Check,
  AlertCircle,
} from "lucide-react";
import confetti from "canvas-confetti";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [focused, setFocused] = useState<string | null>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  const contactTexts = [
    "Let's start a project",
    "Let's connect",
    "Work with me",
    "Get in touch",
    "Let's talk",
  ];
  const [randomText] = useState(
    () => contactTexts[Math.floor(Math.random() * contactTexts.length)],
  );

  useEffect(() => {
    if (status === "success") {
      const t = setTimeout(() => setStatus("idle"), 5000);
      return () => clearTimeout(t);
    }
  }, [status]);

  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (status === "loading") return;
    setStatus("loading");
    setErrorMessage("");

    try {
      if (formData.message.length < 10)
        throw new Error("Message must be at least 10 characters.");

      const res = await fetch("https://api.bbastian.dev/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");

      setStatus("success");
      setFormData({ name: "", email: "", message: "" });

      // Fire confetti from the button
      if (btnRef.current) {
        const rect = btnRef.current.getBoundingClientRect();
        const x = (rect.left + rect.width / 2) / window.innerWidth;
        const y = (rect.top + rect.height / 2) / window.innerHeight;
        confetti({ particleCount: 80, spread: 70, origin: { x, y }, colors: ["#34d399", "#ffffff", "#a7f3d0", "#6ee7b7"] });
      }
    } catch (err: any) {
      setStatus("error");
      setErrorMessage(err.message);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    if (status === "error") setStatus("idle");
  };

  const fields = [
    {
      id: "name",
      label: "Name",
      placeholder: "Your name",
      icon: User,
      type: "text",
    },
    {
      id: "email",
      label: "Email",
      placeholder: "your@email.com",
      icon: Mail,
      type: "email",
    },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center py-24 px-4">
      {/* Header */}
      <div className="w-full max-w-lg mb-10 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/8 bg-white/4 text-xs text-gray-400 font-medium tracking-wide mb-5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          AVAILABLE FOR WORK
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-white mb-3">
          {randomText}
        </h1>
        <p className="text-gray-500 text-sm">
          Send me a message and I'll get back to you as soon as possible.
        </p>
      </div>

      {/* Form card */}
      <div className="w-full max-w-lg bg-[#111111] border border-white/6 rounded-3xl p-6 shadow-2xl shadow-black/40">
        <div className="space-y-3">
          {/* Name + Email */}
          {fields.map(({ id, label, placeholder, icon: Icon, type }) => (
            <div key={id} className="flex flex-col gap-1.5">
              <label
                htmlFor={id}
                className="text-xs font-medium text-gray-500 tracking-wide uppercase pl-1 text-left"
              >
                {label}
              </label>
              <div
                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl border transition-all duration-150 ${
                  focused === id
                    ? "border-emerald-500/50 bg-white/4"
                    : "border-white/6 bg-white/2 hover:border-white/10"
                }`}
              >
                <Icon className="w-4 h-4 text-gray-600 shrink-0" />
                <input
                  id={id}
                  type={type}
                  value={(formData as any)[id]}
                  onChange={handleChange}
                  onFocus={() => setFocused(id)}
                  onBlur={() => setFocused(null)}
                  placeholder={placeholder}
                  className="flex-1 bg-transparent text-sm text-white placeholder-gray-600 outline-none"
                />
              </div>
            </div>
          ))}

          {/* Message */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="message"
              className="text-xs font-medium text-gray-500 tracking-wide uppercase pl-1 text-left"
            >
              Message
            </label>
            <div
              className={`flex gap-3 px-4 py-3.5 rounded-xl border transition-all duration-150 ${
                focused === "message"
                  ? "border-emerald-500/50 bg-white/4"
                  : "border-white/6 bg-white/2 hover:border-white/10"
              }`}
            >
              <MessageSquare className="w-4 h-4 text-gray-600 shrink-0 mt-0.5" />
              <textarea
                id="message"
                value={formData.message}
                onChange={handleChange}
                onFocus={() => setFocused("message")}
                onBlur={() => setFocused(null)}
                placeholder="What's on your mind?"
                rows={5}
                className="flex-1 bg-transparent text-sm text-white placeholder-gray-600 outline-none resize-none leading-relaxed"
              />
            </div>
          </div>

          {/* Spacer */}
          <div className="pt-2" />

          {/* Error */}
          {status === "error" && (
            <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl border border-red-500/20 bg-red-500/8 text-red-400 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {errorMessage}
            </div>
          )}

          {/* Success */}
          {status === "success" && (
            <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl border border-emerald-500/20 bg-emerald-500/8 text-emerald-400 text-sm">
              <Check className="w-4 h-4 shrink-0" />
              Message sent — I'll get back to you soon!
            </div>
          )}

          {/* Submit */}
          <button
            ref={btnRef}
            onClick={handleSubmit}
            disabled={status === "loading" || status === "success"}
            className={`w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
              status === "success"
                ? "bg-emerald-500/15 border border-emerald-500/25 text-emerald-400"
                : "bg-emerald-500 hover:bg-emerald-400 text-black disabled:opacity-50 disabled:cursor-not-allowed"
            }`}
          >
            {status === "loading" ? (
              <>
                <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                Sending…
              </>
            ) : status === "success" ? (
              <>
                <Check className="w-4 h-4" />
                Message Sent
              </>
            ) : (
              <>
                Send Message
                <Send className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Footer hint */}
      <p className="mt-6 text-xs text-gray-600">
        Prefer email?{" "}
        <a
          href="mailto:bastian@bbastian.dev"
          className="text-gray-500 hover:text-gray-300 transition underline underline-offset-2"
        >
          hello@bbastian.dev
        </a>
      </p>
    </div>
  );
}

export default Contact;
