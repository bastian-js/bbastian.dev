import React, { useEffect, useState } from "react";
import {
  Star,
  GitFork,
  Code,
  Clock,
  Activity,
  MapPin,
  GraduationCap,
  Globe,
  Briefcase,
  Laptop,
  Zap,
  Heart,
  Coffee,
  Layers,
} from "lucide-react";

type FactIcon =
  | "map-pin"
  | "graduation-cap"
  | "globe"
  | "briefcase"
  | "laptop"
  | "zap"
  | "heart"
  | "coffee"
  | "layers";

interface Fact {
  icon: FactIcon;
  label: string;
}

const FACT_ICONS: Record<FactIcon, React.ElementType> = {
  "map-pin": MapPin,
  "graduation-cap": GraduationCap,
  globe: Globe,
  briefcase: Briefcase,
  laptop: Laptop,
  zap: Zap,
  heart: Heart,
  coffee: Coffee,
  layers: Layers,
};

interface InfoboxItem {
  title: string;
  titleundertitle: string;
  subtitle: string;
  description: string;
  image: string;
  image_alt?: string;
  facts?: Fact[];
}

interface InfoboxProps {
  items: InfoboxItem[];
}

interface LanguageStat {
  name: string;
  percent: number;
}

interface GitHubStats {
  repos: number;
  stars: number;
  followers: number;
  yearsActive: number;
  languages: LanguageStat[];
  lastActive: string | null;
}

function formatLastActive(iso: string): string {
  const date = new Date(iso);
  const diffDays = Math.floor((Date.now() - date.getTime()) / 86_400_000);
  if (diffDays === 0) return "today";
  if (diffDays === 1) return "yesterday";
  if (diffDays === 2) return "2 days ago";
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  return `${dd}-${mm}-${date.getFullYear()}`;
}

const LANG_COLORS: Record<string, string> = {
  TypeScript: "from-blue-500 to-blue-400",
  JavaScript: "from-yellow-500 to-yellow-400",
  Python: "from-sky-500 to-sky-400",
  Go: "from-cyan-500 to-cyan-400",
  Rust: "from-orange-500 to-orange-400",
  CSS: "from-purple-500 to-purple-400",
  HTML: "from-red-500 to-orange-400",
  Vue: "from-emerald-500 to-emerald-400",
  Swift: "from-orange-400 to-red-400",
  Kotlin: "from-violet-500 to-violet-400",
};

function getLangColor(name: string) {
  return LANG_COLORS[name] ?? "from-gray-500 to-gray-400";
}

const Infobox: React.FC<InfoboxProps> = ({ items }) => {
  const [stats, setStats] = useState<GitHubStats | null>(null);

  useEffect(() => {
    fetch("https://api.bbastian.dev/github-stats")
      .then((res) => res.json())
      .then((data) => {
        setStats({
          repos: Number(data?.repos ?? 0),
          stars: Number(data?.stars ?? 0),
          followers: Number(data?.followers ?? 0),
          yearsActive: Number(data?.yearsActive ?? 0),
          languages: Array.isArray(data?.languages) ? data.languages : [],
          lastActive: data?.lastActive ?? null,
        });
      })
      .catch(() => {});
  }, []);

  const isLoading = !stats;
  const languages = stats?.languages ?? [];

  return (
    <div className="w-full bg-[#0a0a0a] py-16 rounded-4xl text-left">
      <div className="max-w-6xl mx-auto px-4">
        <div className="space-y-6">
          {items.map((item, index) => (
            <div key={index} className="group relative">
              {/* Hover glow border */}
              <div className="absolute -inset-px rounded-3xl bg-linear-to-br from-white/10 via-white/4 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              <div className="relative bg-[#111] rounded-3xl border border-white/6 overflow-hidden">
                {/* Top shimmer line */}
                <div className="h-px bg-linear-to-r from-transparent via-white/15 to-transparent" />

                <div className="p-7 flex flex-col md:flex-row gap-10">
                  {/* LEFT */}
                  <div className="flex-1 flex flex-col gap-3">
                    {/* Profile header */}
                    <div className="flex items-center gap-5">
                      <div className="relative shrink-0">
                        <div className="w-20 h-20 rounded-2xl overflow-hidden ring-1 ring-white/10">
                          <img
                            src={item.image}
                            alt={item.image_alt || item.title}
                            className="w-full h-full object-cover object-[50%_10%] scale-110"
                          />
                        </div>
                        {/* Subtle glow under avatar */}
                        <div className="absolute -inset-1 rounded-2xl bg-white/4 blur-md -z-10" />
                      </div>

                      <div>
                        <h3 className="text-2xl font-bold text-white leading-tight">
                          {item.title}
                        </h3>
                        <p className="text-sm text-gray-500 mt-0.5">
                          {item.titleundertitle}
                        </p>
                      </div>
                    </div>

                    {/* Subtitle badge */}
                    <div className="flex">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/8 text-xs font-medium text-gray-300">
                        <Activity className="w-3 h-3 text-emerald-400" />
                        {item.subtitle}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-gray-400 leading-relaxed text-base">
                      {item.description}
                    </p>

                    {/* Key Facts */}
                    {item.facts && item.facts.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {item.facts.map((fact, i) => {
                          const Icon = FACT_ICONS[fact.icon];
                          return (
                            <span
                              key={i}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/4 border border-white/6 text-sm text-gray-400"
                            >
                              <Icon className="w-3 h-3 text-gray-500 shrink-0" />
                              {fact.label}
                            </span>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* RIGHT STATS */}
                  <div className="hidden md:flex flex-col min-w-[230px]">
                    <div className="bg-[#0d0d0d] rounded-2xl border border-white/5 p-5 flex flex-col gap-5 h-full">
                      {/* Repos + Stars grid */}
                      <div className="grid grid-cols-2 gap-2.5">
                        <div className="flex flex-col items-center justify-center bg-white/4 rounded-xl py-3 px-2 gap-1">
                          <GitFork className="w-4 h-4 text-emerald-400 mb-0.5" />
                          <p className="text-lg font-bold text-white leading-none">
                            {isLoading ? (
                              <span className="animate-pulse text-gray-600">
                                ••
                              </span>
                            ) : (
                              stats.repos
                            )}
                          </p>
                          <p className="text-[10px] text-gray-500 uppercase tracking-wide">
                            Repos
                          </p>
                        </div>
                        <div className="flex flex-col items-center justify-center bg-white/4 rounded-xl py-3 px-2 gap-1">
                          <Star className="w-4 h-4 text-yellow-400 mb-0.5" />
                          <p className="text-lg font-bold text-white leading-none">
                            {isLoading ? (
                              <span className="animate-pulse text-gray-600">
                                ••
                              </span>
                            ) : (
                              stats.stars
                            )}
                          </p>
                          <p className="text-[10px] text-gray-500 uppercase tracking-wide">
                            Stars
                          </p>
                        </div>
                      </div>

                      {/* Divider */}
                      <div className="h-px bg-white/5" />

                      {/* Languages */}
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-1.5">
                          <Code className="w-3.5 h-3.5 text-gray-600" />
                          <span className="text-[10px] font-semibold text-gray-600 uppercase tracking-widest">
                            Languages
                          </span>
                        </div>

                        <div className="flex flex-col gap-2.5">
                          {isLoading
                            ? Array.from({ length: 3 }).map((_, i) => (
                                <div
                                  key={i}
                                  className="flex flex-col gap-1 animate-pulse"
                                >
                                  <div className="flex justify-between">
                                    <div className="h-3 bg-white/6 rounded w-16" />
                                    <div className="h-3 bg-white/4 rounded w-8" />
                                  </div>
                                  <div className="h-1 bg-white/6 rounded-full w-full" />
                                </div>
                              ))
                            : languages.map((lang) => (
                                <div
                                  key={lang.name}
                                  className="flex flex-col gap-1"
                                >
                                  <div className="flex justify-between text-xs">
                                    <span className="text-gray-300 font-medium">
                                      {lang.name}
                                    </span>
                                    <span className="text-gray-600">
                                      {lang.percent}%
                                    </span>
                                  </div>
                                  <div className="h-1 bg-white/6 rounded-full overflow-hidden">
                                    <div
                                      className={`h-full bg-linear-to-r ${getLangColor(lang.name)} rounded-full`}
                                      style={{ width: `${lang.percent}%` }}
                                    />
                                  </div>
                                </div>
                              ))}
                        </div>
                      </div>

                      {/* Divider */}
                      <div className="h-px bg-white/5 mt-auto" />

                      {/* Active years + Last active */}
                      <div className="flex flex-col gap-2.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="flex items-center gap-1.5 text-gray-600">
                            <Activity className="w-3 h-3" />
                            Active for
                          </span>
                          <span className="text-gray-300 font-medium">
                            {isLoading ? (
                              <span className="animate-pulse text-gray-600">
                                —
                              </span>
                            ) : (
                              `${stats.yearsActive}+ years`
                            )}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="flex items-center gap-1.5 text-gray-600">
                            <Clock className="w-3 h-3" />
                            Last active
                          </span>
                          <span className="text-gray-300 font-medium">
                            {isLoading ? (
                              <span className="animate-pulse text-gray-600">
                                —
                              </span>
                            ) : stats.lastActive ? (
                              formatLastActive(stats.lastActive)
                            ) : (
                              "—"
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Infobox;
