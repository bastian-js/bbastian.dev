import { Link } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <>
      <style>{`
        @keyframes glitch-1 {
          0%,100% { clip-path: polygon(0 15%, 100% 15%, 100% 30%, 0 30%); transform: translate(-4px, 0); }
          25%      { clip-path: polygon(0 60%, 100% 60%, 100% 75%, 0 75%); transform: translate(4px, 0); }
          50%      { clip-path: polygon(0 40%, 100% 40%, 100% 50%, 0 50%); transform: translate(-2px, 0); }
          75%      { clip-path: polygon(0 80%, 100% 80%, 100% 90%, 0 90%); transform: translate(2px, 0); }
        }
        @keyframes glitch-2 {
          0%,100% { clip-path: polygon(0 50%, 100% 50%, 100% 65%, 0 65%); transform: translate(3px, 0); }
          33%      { clip-path: polygon(0 10%, 100% 10%, 100% 25%, 0 25%); transform: translate(-3px, 0); }
          66%      { clip-path: polygon(0 70%, 100% 70%, 100% 85%, 0 85%); transform: translate(1px, 0); }
        }
        .glitch { position: relative; }
        .glitch::before,
        .glitch::after {
          content: attr(data-text);
          position: absolute;
          inset: 0;
          opacity: 0;
        }
        .glitch:hover::before {
          color: #22d3ee;
          opacity: 0.7;
          animation: glitch-1 0.4s steps(1) infinite;
        }
        .glitch:hover::after {
          color: #f43f5e;
          opacity: 0.7;
          animation: glitch-2 0.4s steps(1) infinite;
        }
      `}</style>

      <div className="min-h-[85vh] flex flex-col items-center justify-center px-6 select-none">
        <div className="text-center">
          <h1
            className="glitch text-[clamp(6rem,20vw,12rem)] font-black leading-none text-white/90 tabular-nums"
            data-text="404"
          >
            404
          </h1>

          <p className="text-xl font-semibold text-white mt-2 mb-2">
            Page not found
          </p>
          <p className="text-gray-500 text-sm mb-10 max-w-xs mx-auto">
            This page doesn't exist or was moved.{" "}
          </p>

          <div className="flex gap-3 justify-center">
            <Link
              to="/"
              className="flex items-center gap-2 px-5 py-2.5 bg-white text-black font-semibold rounded-xl text-sm hover:bg-gray-200 transition"
            >
              <Home className="w-4 h-4" />
              Home
            </Link>
            <button
              onClick={() => window.history.back()}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#1a1a1a] border border-white/10 text-white font-semibold rounded-xl text-sm hover:bg-[#222] transition"
            >
              <ArrowLeft className="w-4 h-4" />
              Go back
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
