import { useEffect, useRef, useState } from "react";
import { Code, Rocket, Sparkles, ShieldCheck } from "lucide-react";

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

export default function AboutSection() {
  const hero = useReveal();
  const cards = useReveal();
  const values = useReveal();

  return (
    <div className="w-full bg-[#0a0a0a] text-white py-20 px-6">
      <div className="max-w-6xl mx-auto space-y-16">
        {/* HERO */}
        <div
          ref={hero.ref}
          className={`text-center transition-all duration-1000 ${
            hero.visible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
          }`}
        >
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 p-[3px]">
            <img
              src="/profile_picture.png"
              alt="Profile"
              className="w-full h-full rounded-full object-cover border-4 border-[#0a0a0a]"
            />
          </div>

          <h1 className="text-3xl font-bold mb-3 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            About Me
          </h1>

          <p className="text-gray-400 max-w-xl mx-auto text-base">
            I build clean, fast and scalable digital products — focused on real
            usability, not buzzwords.
          </p>
        </div>

        {/* WHAT I DO */}
        <div
          ref={cards.ref}
          className={`grid grid-cols-1 md:grid-cols-3 gap-6 transition-all duration-1000 ${
            cards.visible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
          }`}
        >
          {[
            {
              title: "Clean Code",
              text: "Readable, maintainable and built to scale without pain.",
              icon: Code,
              color: "from-blue-500 to-cyan-500",
            },
            {
              title: "Fast Products",
              text: "Performance matters. Speed is a feature, not an afterthought.",
              icon: Rocket,
              color: "from-emerald-500 to-green-600",
            },
            {
              title: "Polished UX",
              text: "Interfaces should feel effortless and intentional.",
              icon: Sparkles,
              color: "from-purple-500 to-pink-500",
            },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                key={i}
                className="
                  bg-[#1a1a1a] border border-white/5 rounded-2xl p-6
                  hover:scale-[1.03] transition-all duration-300
                "
              >
                <div
                  className={`w-12 h-12 mx-auto rounded-xl bg-gradient-to-br ${item.color}
  flex items-center justify-center mb-4`}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>

                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {item.text}
                </p>
              </div>
            );
          })}
        </div>

        {/* PHILOSOPHY */}
        <div
          ref={values.ref}
          className={`transition-all duration-1000 ${
            values.visible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
          }`}
        >
          <div className="bg-[#1a1a1a] border border-white/5 rounded-3xl p-8 text-center">
            <ShieldCheck className="w-10 h-10 mx-auto text-emerald-400 mb-4" />

            <h3 className="text-2xl font-bold mb-2">My Philosophy</h3>

            <p className="text-gray-400 max-w-2xl mx-auto leading-relaxed">
              I focus on clarity over complexity, quality over quantity and
              long-term solutions instead of quick hacks. Every project should
              feel solid, intentional and future-proof.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
