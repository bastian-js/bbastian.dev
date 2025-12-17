import React, { useState } from "react";
import { Send, Mail, User, MessageSquare } from "lucide-react";
import Footer from "../components/Footer";

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

  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setStatus("success");
      setFormData({ name: "", email: "", message: "" });
    } catch (err: any) {
      setStatus("error");
      setErrorMessage(err.message);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  return (
    <>
      <div className="min-h-screen bg-[#0a0a0a] text-white py-24 px-6">
        {/* Header */}
        <div className="max-w-7xl mx-auto text-center mb-10">
          <div className="mb-10 inline-block relative">
            <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-green-400 to-green-700 p-1 mx-auto">
              <img
                src="/profile_picture.png"
                alt="Profile"
                className="w-full h-full rounded-full object-cover border-4 border-[#0a0a0a]"
              />
            </div>
          </div>

          <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
            Bastian
          </h1>

          <p className="text-gray-400 text-2xl mb-4">
            {contactTexts[Math.floor(Math.random() * contactTexts.length)]}
          </p>

          <div className="flex items-center justify-center gap-2 text-green-400">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-sm font-medium">Available for projects</span>
          </div>
        </div>

        {/* Form */}
        <div className="max-w-full px-12 mx-auto">
          <div className="space-y-8">
            {/* Name */}
            <div className="relative">
              <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500">
                <User className="w-5 h-5" />
              </div>
              <input
                id="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-[#141414] border-2 border-white/5 rounded-3xl pl-16 pr-8 py-7 text-white text-lg"
                placeholder="Your Name"
              />
            </div>

            {/* Email */}
            <div className="relative">
              <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500">
                <Mail className="w-5 h-5" />
              </div>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-[#141414] border-2 border-white/5 rounded-3xl pl-16 pr-8 py-7 text-white text-lg"
                placeholder="Your Email"
              />
            </div>

            {/* Message */}
            <div className="relative">
              <div className="absolute left-6 top-7 text-gray-500">
                <MessageSquare className="w-5 h-5" />
              </div>
              <textarea
                id="message"
                value={formData.message}
                onChange={handleChange}
                className="w-full bg-[#141414] border-2 border-white/5 rounded-3xl pl-16 pr-8 py-7 text-white text-lg min-h-[160px]"
                placeholder="Your Message"
              />
            </div>

            {/* Status Box */}
            {status === "success" && (
              <div className="rounded-2xl border border-green-500/30 bg-green-500/10 px-6 py-4 text-green-400">
                ✅ Message sent successfully.
              </div>
            )}

            {status === "error" && (
              <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-6 py-4 text-red-400">
                ❌ {errorMessage}
              </div>
            )}

            {/* Button */}
            <button
              onClick={handleSubmit}
              disabled={status === "loading"}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold text-xl py-7 rounded-3xl
                         transition-all duration-300 disabled:opacity-60"
            >
              <span className="flex items-center justify-center gap-3">
                {status === "loading" ? "Sending…" : "Send Message"}
                <Send className="w-5 h-5" />
              </span>
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default Contact;
