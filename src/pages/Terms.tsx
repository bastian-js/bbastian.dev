import { Link } from "react-router-dom";
import {
  Scale,
  FileText,
  Shield,
  Globe,
  Ban,
  RefreshCw,
  Mail,
  MapPin,
  ArrowUpRight,
} from "lucide-react";

const CONTACT_EMAIL = "hello@bbastian.dev";
const LAST_UPDATED = "14. May 2026";

interface Section {
  icon: React.ElementType;
  title: string;
  content: React.ReactNode;
}

export default function Terms() {
  const sections: Section[] = [
    {
      icon: FileText,
      title: "Acceptance of terms",
      content: (
        <p className="text-left text-sm text-gray-400 leading-relaxed">
          By accessing or using this website (bbastian.dev) and its subpages,
          you agree to these Terms of Use. If you do not agree, please do not
          use this website. These terms apply to all visitors and users of the
          site.
        </p>
      ),
    },
    {
      icon: Globe,
      title: "Use of the website",
      content: (
        <div className="space-y-3">
          <p className="text-left text-sm text-gray-400 leading-relaxed">
            This website is a personal portfolio. You may browse, share links,
            and interact with public features (such as the contact form) for
            personal, non-commercial purposes.
          </p>
          <ul className="space-y-2 text-sm text-gray-400 leading-relaxed">
            {[
              "You may not scrape, copy, or mirror the content of this site without prior written permission.",
              "You may not use this site in a way that could harm, disable, or impair its availability.",
              "Automated access (bots, crawlers) beyond standard search engine indexing is not permitted.",
            ].map((item) => (
              <li key={item} className="text-left flex gap-2">
                <span className="text-emerald-500 mt-0.5 shrink-0">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      ),
    },
    {
      icon: Shield,
      title: "Intellectual property",
      content: (
        <div className="space-y-3">
          <p className="text-left text-sm text-gray-400 leading-relaxed">
            All content on this website — including text, design, code, images,
            and project descriptions — is the intellectual property of the site
            owner unless otherwise noted.
          </p>
          <ul className="space-y-2 text-sm text-gray-400 leading-relaxed">
            {[
              "Project screenshots and logos of third-party products belong to their respective owners.",
              "Open-source code linked via GitHub is subject to its own license (typically MIT). See each repository's LICENSE file.",
              "You may not reproduce or redistribute content from this site without explicit permission.",
            ].map((item) => (
              <li key={item} className="text-left flex gap-2">
                <span className="text-emerald-500 mt-0.5 shrink-0">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      ),
    },
    {
      icon: Globe,
      title: "Third-party services",
      content: (
        <div className="space-y-3">
          <p className="text-left text-sm text-gray-400 leading-relaxed">
            This website integrates or links to third-party services. These are
            governed by their own terms and privacy policies — not by these
            terms.
          </p>
          <ul className="space-y-2 text-sm text-gray-400 leading-relaxed">
            {[
              "Spotify — the Spotify Stats section uses the Spotify Web API under OAuth 2.0. Spotify's terms apply to that integration.",
              "GitHub — project links point to external GitHub repositories. GitHub's terms apply.",
              "External links — this site may link to third-party websites. No responsibility is assumed for their content or availability.",
            ].map((item) => (
              <li key={item} className="text-left flex gap-2">
                <span className="text-gray-600 mt-0.5 shrink-0">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      ),
    },
    {
      icon: Ban,
      title: "Accuracy of content",
      content: (
        <div className="space-y-3">
          <p className="text-left text-sm text-gray-400 leading-relaxed">
            This website describes personal projects and experiences in good
            faith. However:
          </p>
          <ul className="space-y-2 text-sm text-gray-400 leading-relaxed">
            {[
              "Project descriptions, timelines, and technology stacks may change without notice.",
              "Content is provided for informational purposes only and is not guaranteed to be complete or up to date.",
              "Any opinions or statements expressed are personal and do not represent any employer or institution.",
            ].map((item) => (
              <li key={item} className="text-left flex gap-2">
                <span className="text-gray-600 mt-0.5 shrink-0">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      ),
    },
    {
      icon: Shield,
      title: "Limitation of liability",
      content: (
        <ul className="space-y-2 text-sm text-gray-400 leading-relaxed">
          {[
            'This website is provided "as is" without warranties of any kind, express or implied.',
            "No liability is accepted for any loss or damage arising from your use of or inability to access this website.",
            "No liability is accepted for content on any external site that this website links to.",
            "Uptime and availability are not guaranteed. The site may be offline for maintenance at any time.",
          ].map((item) => (
            <li key={item} className="text-left flex gap-2">
              <span className="text-red-500/60 mt-0.5 shrink-0">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      ),
    },
    {
      icon: RefreshCw,
      title: "Changes to these terms",
      content: (
        <p className="text-left text-sm text-gray-400 leading-relaxed">
          These terms may be updated at any time without prior notice. The "last
          updated" date at the top of this page reflects the most recent
          revision. Continued use of the website after any update constitutes
          acceptance of the revised terms.
        </p>
      ),
    },
    {
      icon: Scale,
      title: "Governing law",
      content: (
        <div className="space-y-3 text-sm text-gray-400 leading-relaxed text-left">
          <p>
            These terms are governed by the laws of Austria. Any disputes
            arising from the use of this website are subject to Austrian
            jurisdiction, unless mandatory local consumer protection laws in
            your country of residence apply.
          </p>
          <p className="text-xs text-gray-600">
            EU consumers may also use the European Commission's Online Dispute
            Resolution platform:{" "}
            <span className="text-gray-500">ec.europa.eu/consumers/odr</span>
          </p>
        </div>
      ),
    },
    {
      icon: Mail,
      title: "Contact",
      content: (
        <div className="space-y-2">
          <p className="text-left text-sm text-gray-500 mb-3">
            Questions or concerns about these terms:
          </p>
          <div className="flex items-center gap-3 px-3 py-2.5 bg-white/3 border border-white/6 rounded-xl">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
              <Shield className="w-3.5 h-3.5" />
            </div>
            <div>
              <p className="text-left text-xs text-gray-600 leading-none mb-0.5">
                Responsible person
              </p>
              <p className="text-left text-sm font-medium text-white">
                Bastian
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 px-3 py-2.5 bg-white/3 border border-white/6 rounded-xl">
            <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
              <MapPin className="w-3.5 h-3.5" />
            </div>
            <div>
              <p className="text-xs text-gray-600 leading-none mb-0.5">
                Location
              </p>
              <p className="text-sm font-medium text-white">Austria</p>
            </div>
          </div>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="text-left flex items-center gap-3 px-3 py-2.5 bg-white/3 border border-white/6 rounded-xl hover:border-emerald-500/30 hover:bg-emerald-500/5 transition-all duration-150 group"
          >
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
              <Mail className="w-3.5 h-3.5" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-600 leading-none mb-0.5">Email</p>
              <p className="text-sm font-medium text-emerald-400 group-hover:underline underline-offset-2">
                {CONTACT_EMAIL}
              </p>
            </div>
          </a>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white text-left py-24 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/8 bg-white/4 text-xs text-gray-400 font-medium tracking-wide mb-5">
            <Scale className="w-3 h-3 text-emerald-400" />
            bbastian.dev · Terms of Use
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-white mb-3">
            Terms of Use
          </h1>
          <p className="text-gray-500 text-sm leading-relaxed max-w-md">
            The rules that apply when visiting or using this website and its
            features.
          </p>
          <p className="text-gray-700 text-xs mt-3">
            Last updated: {LAST_UPDATED}
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-3">
          {sections.map(({ icon: Icon, title, content }) => (
            <div
              key={title}
              className="bg-[#111] border border-white/6 rounded-2xl p-5"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-emerald-500/10 text-emerald-400 shrink-0">
                  <Icon className="w-4 h-4" />
                </div>
                <h2 className="text-sm font-semibold text-white">{title}</h2>
              </div>
              {content}
            </div>
          ))}
        </div>

        {/* Related legal pages */}
        <div className="mt-10 pt-8 border-t border-white/6">
          <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-gray-600 mb-5">
            Also relevant
          </p>
          <div className="flex flex-col gap-px">
            {[
              {
                label: "Privacy Policy",
                sub: "This website — data collection, hosting, your rights",
                href: "/privacy",
              },
              {
                label: "Noury Privacy Policy",
                sub: "Noury app — health data, AI processing, account deletion",
                href: "/noury/privacy",
              },
              {
                label: "Noury Terms of Service",
                sub: "Noury app — subscriptions, AI disclaimers, acceptable use",
                href: "/noury/terms",
              },
            ].map(({ label, sub, href }) => (
              <Link
                key={href}
                to={href}
                className="group relative flex items-center justify-between gap-4 py-4 px-3 -mx-3 rounded-xl transition-all duration-200"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
              >
                {/* hover background */}
                <div
                  className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
                  style={{ background: "rgba(255,255,255,0.03)" }}
                />
                <div className="relative min-w-0">
                  <p className="text-sm font-semibold text-gray-300 group-hover:text-white transition-colors duration-200 mb-0.5">
                    {label}
                  </p>
                  <p className="text-xs text-gray-600 group-hover:text-gray-400 transition-colors duration-200 leading-relaxed">
                    {sub}
                  </p>
                </div>
                <ArrowUpRight
                  className="relative w-4 h-4 shrink-0 text-gray-700 group-hover:text-white transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </Link>
            ))}
          </div>
        </div>

        <p className="text-left text-xs text-gray-700 mt-6">
          These terms apply to{" "}
          <span className="text-gray-600">bbastian.dev</span> and all subpages.
        </p>
      </div>
    </div>
  );
}
