import React, { useEffect, useState } from "react";
import { Star, GitFork, Code } from "lucide-react";

interface InfoboxItem {
  title: string;
  titleundertitle: string;
  subtitle: string;
  description: string;
  image: string;
  image_alt?: string;
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
    <div className="w-full bg-[#0a0a0a] py-16 px-4">
      <div className="max-w-6xl mx-auto relative">
        <div className="relative space-y-20">
          {items.map((item, index) => (
            <div
              key={index}
              className="bg-[#1a1a1a] p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex flex-col md:flex-row gap-10">
                {/* LEFT CONTENT */}
                <div className="flex-1 text-left">
                  {/* Title */}
                  <div className="flex items-center gap-4 mb-2">
                    <div className="w-30 h-30 rounded-full overflow-hidden shrink-0">
                      <img
                        src={item.image}
                        alt={item.image_alt || item.title}
                        className="w-full h-full object-cover object-[50%_10%] scale-120"
                      />
                    </div>

                    <div className="flex flex-col">
                      <h3 className="text-2xl font-bold text-white">
                        {item.title}
                      </h3>
                      <h4 className="text-lg font-semibold text-gray-300">
                        {item.titleundertitle}
                      </h4>
                    </div>
                  </div>

                  {/* Subtitle */}
                  <h4 className="text-xl font-semibold text-gray-300 mb-3 mt-5">
                    {item.subtitle}
                  </h4>

                  {/* Description */}
                  <p className="text-gray-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* RIGHT STATS – IMMER SICHTBAR */}
                <div className="hidden md:flex flex-col">
                  <div className="bg-[#141414] border border-white/5 rounded-xl px-6 py-5 flex flex-col gap-6 min-w-[220px]">
                    {/* Repos */}
                    <div className="flex items-center gap-4">
                      <GitFork className="w-6 h-6 text-emerald-400" />
                      <div className="flex flex-col items-start text-left">
                        <p className="text-xl font-bold text-white">
                          {isLoading ? (
                            <span className="animate-pulse text-gray-600">
                              •••
                            </span>
                          ) : (
                            stats.repos
                          )}
                        </p>
                        <p className="text-sm text-gray-400">Repositories</p>
                      </div>
                    </div>

                    {/* Stars */}
                    <div className="flex items-center gap-4">
                      <Star className="w-6 h-6 text-yellow-400" />
                      <div className="flex flex-col items-start text-left">
                        <p className="text-xl font-bold text-white">
                          {isLoading ? (
                            <span className="animate-pulse text-gray-600">
                              •••
                            </span>
                          ) : (
                            stats.stars
                          )}
                        </p>
                        <p className="text-sm text-gray-400">Stars</p>
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="h-px bg-white/5" />

                    {/* Languages */}
                    <div className="flex items-center gap-2 text-gray-300">
                      <Code className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-medium">
                        Most used languages
                      </span>
                    </div>

                    <div className="flex flex-col gap-2">
                      {isLoading
                        ? Array.from({ length: 3 }).map((_, i) => (
                            <div
                              key={i}
                              className="flex justify-between text-sm animate-pulse"
                            >
                              <span className="text-gray-600">Loading</span>
                              <span className="text-gray-700">--%</span>
                            </div>
                          ))
                        : languages.map((lang) => (
                            <div
                              key={lang.name}
                              className="flex justify-between text-sm"
                            >
                              <span className="text-gray-300">{lang.name}</span>
                              <span className="text-gray-400">
                                {lang.percent}%
                              </span>
                            </div>
                          ))}
                    </div>

                    {/* Active years */}
                    <p className="text-sm text-gray-500 pt-1">
                      {isLoading ? (
                        <span className="animate-pulse">Active for — years</span>
                      ) : (
                        `Active for ${stats.yearsActive}+ years`
                      )}
                    </p>

                    {/* Last active */}
                    <div className="flex items-center justify-between text-sm pt-0">
                      <span className="text-gray-500">Last active</span>
                      <span className="text-gray-300 font-medium">
                        {isLoading ? (
                          <span className="animate-pulse text-gray-600">———</span>
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
          ))}
        </div>
      </div>
    </div>
  );
};

export default Infobox;
