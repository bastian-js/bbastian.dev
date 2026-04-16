import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Noury() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [alreadySignedUp] = useState(
    () => localStorage.getItem("noury_waitlist") === "true",
  );
  const [waitlistCount, setWaitlistCount] = useState<number | null>(null);

  useEffect(() => {
    fetch("https://api.bbastian.dev/noury/waitlist/count")
      .then((r) => r.json())
      .then((d) => setWaitlistCount(d.count))
      .catch(() => {});
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch("https://api.bbastian.dev/noury/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message ?? "Something went wrong.");
      }
      localStorage.setItem("noury_waitlist", "true");
      setStatus("success");
      setEmail("");
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
      setStatus("error");
    }
  }

  return (
    <div className="pt-20 pb-20 px-4 text-left">
      {/* Back button — top left */}
      <div className="max-w-3xl mx-auto mb-6">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-white transition-colors duration-150"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="15"
            height="15"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back
        </Link>
      </div>

      <div className="max-w-3xl mx-auto space-y-4">
        {/* Hero */}
        <div className="relative overflow-hidden rounded-3xl border border-emerald-300/20 bg-[#0b1612]">
          {/* Background grid */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.035]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
          {/* Glows */}
          <div className="pointer-events-none absolute -top-20 -right-20 h-72 w-72 rounded-full bg-emerald-400/25 blur-[80px]" />
          <div className="pointer-events-none absolute -bottom-16 -left-12 h-56 w-56 rounded-full bg-cyan-400/20 blur-[60px]" />
          <div className="pointer-events-none absolute top-1/2 left-1/3 h-40 w-40 rounded-full bg-teal-300/10 blur-[50px]" />

          <div className="relative p-8 md:p-14">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-300/40 bg-emerald-300/10 px-3.5 py-1 text-[11px] font-bold tracking-[0.2em] text-emerald-200 uppercase">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                </span>
                Coming Soon
              </span>
              {waitlistCount !== null && waitlistCount > 0 && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold text-gray-400">
                  <span className="text-emerald-400 font-bold">{waitlistCount}</span>
                  {waitlistCount === 1 ? "person" : "people"} on the waitlist
                </span>
              )}
            </div>

            <div className="mt-6 flex items-end gap-4 flex-wrap">
              <h1 className="text-6xl font-black tracking-tight text-white md:text-7xl">
                Noury
              </h1>
              <span className="mb-2 text-xl font-medium text-emerald-300/80 md:text-2xl">
                /ˈnuː.ri/
              </span>
            </div>

            <p className="mt-5 max-w-xl text-base leading-relaxed text-gray-400 md:text-lg">
              An AI-powered calorie tracking app. Log meals instantly with a
              photo, or enter them manually — and track your daily kcal,
              protein, fat, and carbs with a clean, focused interface.
            </p>

            {/* Tags */}
            <div className="mt-8 flex flex-wrap gap-2">
              {[
                "AI Photo Scan",
                "Manual Entry",
                "Daily Tracking",
                "5-day Free Trial",
              ].map((label) => (
                <span
                  key={label}
                  className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-gray-400"
                >
                  {label}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Waitlist */}
        {!alreadySignedUp && (
          <div className="rounded-3xl border border-emerald-300/20 bg-[#0b1612] p-7 md:p-10">
            <div className="pointer-events-none absolute -top-20 -right-20 h-72 w-72 rounded-full bg-emerald-400/10 blur-[80px]" />
            <p className="text-xs font-bold tracking-[0.18em] text-emerald-300 uppercase mb-1">
              Waitlist
            </p>
            <h2 className="text-3xl font-black text-white">
              Be the first to know.
            </h2>
            <p className="mt-1.5 text-sm text-gray-500">
              Drop your email and we'll notify you the moment Noury launches.
            </p>

            {status === "success" ? (
              <div className="mt-6 flex items-center gap-3 rounded-2xl border border-emerald-400/30 bg-emerald-400/10 px-5 py-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.2}
                  className="text-emerald-400 shrink-0"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 12.75l6 6 9-13.5"
                  />
                </svg>
                <p className="text-sm font-semibold text-emerald-300">
                  You're on the list — we'll be in touch!
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="mt-6 flex flex-col sm:flex-row gap-3"
              >
                <input
                  type="email"
                  required
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-gray-600 outline-none focus:border-emerald-400/50 focus:ring-1 focus:ring-emerald-400/30 transition-colors"
                />
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed px-6 py-3 text-sm font-bold text-black transition-colors duration-150 shrink-0"
                >
                  {status === "loading" ? "Joining…" : "Join Waitlist"}
                </button>
              </form>
            )}

            {status === "error" && (
              <p className="mt-3 text-xs text-red-400">{errorMsg}</p>
            )}
          </div>
        )}

        {/* App Store CTA */}
        <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/8 bg-white/3 px-6 py-5">
          <div>
            <p className="text-sm font-semibold text-white">Available on iOS</p>
            <p className="mt-0.5 text-xs text-gray-500">
              Launching soon on the App Store
            </p>
          </div>
          <button
            disabled
            title="Coming soon"
            className="inline-flex items-center gap-3 rounded-xl bg-black border border-white/15 px-5 py-3 opacity-50 cursor-not-allowed select-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              fill="none"
              viewBox="0 0 24 24"
              stroke="white"
              strokeWidth={1.6}
            >
              <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
              <line
                x1="12"
                y1="18"
                x2="12.01"
                y2="18"
                strokeLinecap="round"
                strokeWidth={2}
              />
            </svg>
            <div className="text-left leading-tight">
              <p className="text-[10px] font-medium text-white/60 tracking-wide">
                Download on the
              </p>
              <p className="text-[15px] font-bold text-white tracking-tight">
                App Store
              </p>
            </div>
          </button>
        </div>

        {/* Features */}
        <div className="grid gap-3 md:grid-cols-3">
          {[
            {
              icon: (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.8}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z"
                  />
                </svg>
              ),
              title: "AI Photo Scan",
              desc: "Snap a photo of your meal and let Noury identify the dish and estimate its nutritional values automatically.",
              colorClass: "bg-emerald-400/15 text-emerald-300",
            },
            {
              icon: (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.8}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                  />
                </svg>
              ),
              title: "Manual Entry",
              desc: "Add meals manually with full control over kcal, protein, fat, and carbs for precise, consistent tracking.",
              colorClass: "bg-cyan-400/15 text-cyan-300",
            },
            {
              icon: (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.8}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
                  />
                </svg>
              ),
              title: "Daily Overview",
              desc: "Clean daily summaries and progress tracking keep you consistent toward your personal nutrition goals.",
              colorClass: "bg-teal-400/15 text-teal-300",
            },
          ].map(({ icon, title, desc, colorClass }) => (
            <div
              key={title}
              className="rounded-2xl border border-white/8 bg-white/3 p-5 flex flex-col gap-3"
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center ${colorClass}`}
              >
                {icon}
              </div>
              <div>
                <p className="text-sm font-semibold text-white">{title}</p>
                <p className="mt-1 text-sm text-gray-500 leading-relaxed">
                  {desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Pricing */}
        <div className="rounded-3xl border border-white/10 bg-[#0d0d0d] p-7 md:p-10">
          <div className="flex items-end justify-between mb-7">
            <div>
              <p className="text-xs font-bold tracking-[0.18em] text-emerald-300 uppercase mb-1">
                Pricing
              </p>
              <h2 className="text-3xl font-black text-white">Simple & fair.</h2>
              <p className="mt-1.5 text-sm text-gray-500">
                5-day free trial included. No credit card needed to start.
              </p>
            </div>
            <span className="hidden md:block text-xs font-semibold tracking-[0.12em] text-gray-600 uppercase">
              Cancel anytime
            </span>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {/* Monthly */}
            <div className="rounded-2xl border border-white/8 bg-white/3 p-6">
              <p className="text-xs font-bold tracking-[0.14em] text-gray-500 uppercase">
                Monthly
              </p>
              <div className="mt-4 flex items-end gap-1.5">
                <span className="text-5xl font-black text-white leading-none">
                  € 4.99
                </span>
                <span className="mb-1 text-sm text-gray-500">/ mo</span>
              </div>
              <p className="mt-4 text-sm text-gray-500 leading-relaxed">
                Flexible month-to-month access. Cancel whenever you want.
              </p>
            </div>

            {/* Yearly */}
            <div className="relative rounded-2xl border border-emerald-400/30 bg-linear-to-br from-emerald-400/10 via-transparent to-transparent p-6 overflow-hidden">
              <div className="pointer-events-none absolute -top-8 -right-8 h-32 w-32 rounded-full bg-emerald-400/15 blur-3xl" />
              <div className="relative">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold tracking-[0.14em] text-emerald-300 uppercase">
                    Yearly
                  </p>
                  <span className="rounded-full bg-emerald-400/20 border border-emerald-300/30 px-2.5 py-0.5 text-[10px] font-bold text-emerald-200 tracking-wide">
                    BEST VALUE
                  </span>
                </div>
                <div className="mt-4 flex items-end gap-1.5">
                  <span className="text-5xl font-black text-white leading-none">
                    € 29.99
                  </span>
                  <span className="mb-1 text-sm text-gray-400">/ yr</span>
                </div>
                <p className="mt-1 text-xs font-semibold text-emerald-400">
                  ~ € 2.50 / month — save over 50%
                </p>
                <p className="mt-3 text-sm text-gray-400 leading-relaxed">
                  Best for long-term tracking. One payment, full year access.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Noury;
