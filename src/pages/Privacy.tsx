import {
  Shield,
  Mail,
  FileText,
  Trash2,
  Eye,
  Server,
  MapPin,
} from "lucide-react";

const CONTACT_EMAIL = "hello@bbastian.dev";
const LAST_UPDATED = "20. April 2026";

interface Section {
  icon: React.ElementType;
  title: string;
  content: React.ReactNode;
}

export default function Privacy() {
  const sections: Section[] = [
    {
      icon: FileText,
      title: "What data is collected",
      content: (
        <ul className="space-y-2 text-sm text-gray-400 leading-relaxed">
          <li className="text-left flex gap-2">
            <span className="text-emerald-500 mt-0.5 shrink-0">•</span>
            <span>
              <strong className="text-gray-300">Contact form</strong> — when you
              send a message, your name, e-mail address and message text are
              transmitted to me via e-mail. No data is stored in a database.
            </span>
          </li>
          <li className="text-left flex gap-2">
            <span className="text-emerald-500 mt-0.5 shrink-0">•</span>
            <span>
              <strong className="text-gray-300">Server logs</strong> — the
              server may temporarily log your IP address, browser type and the
              page requested. These logs are not evaluated personally and are
              deleted automatically after a short period.
            </span>
          </li>
          <li className="text-left flex gap-2">
            <span className="text-emerald-500 mt-0.5 shrink-0">•</span>
            <span>
              <strong className="text-gray-300">Spotify widget</strong> — the
              "Now Playing" widget fetches data from my own API which queries
              the Spotify API. No visitor data is sent to Spotify.
            </span>
          </li>
        </ul>
      ),
    },
    {
      icon: Eye,
      title: "Purpose of processing",
      content: (
        <p className="text-left text-sm text-gray-400 leading-relaxed">
          Contact form data is used exclusively to reply to your message. No
          data is sold, shared with third parties, or used for marketing. This
          website does not use cookies, analytics tools, or any tracking
          technology.
        </p>
      ),
    },
    {
      icon: Server,
      title: "Hosting & third parties",
      content: (
        <ul className="space-y-2 text-sm text-gray-400 leading-relaxed">
          <li className="text-left flex gap-2">
            <span className="text-left text-emerald-500 mt-0.5 shrink-0">
              •
            </span>
            <span>
              This site is hosted on a server located in the EU. The hosting
              provider may process technical access data (IP, timestamps) as
              part of their service.
            </span>
          </li>
          <li className="text-left flex gap-2">
            <span className="text-left text-emerald-500 mt-0.5 shrink-0">
              •
            </span>
            <span>
              No Google Analytics, Meta Pixel, or any other third-party tracking
              is used.
            </span>
          </li>
        </ul>
      ),
    },
    {
      icon: Shield,
      title: "Your rights (DSGVO / GDPR)",
      content: (
        <ul className="space-y-2 text-sm text-gray-400 leading-relaxed text-left">
          <li className="flex gap-2">
            <span className="text-emerald-500 mt-0.5 shrink-0">•</span>
            <span>
              <strong className="text-gray-300">Right of access</strong> — you
              can request information about data stored about you at any time.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-emerald-500 mt-0.5 shrink-0">•</span>
            <span>
              <strong className="text-gray-300">Right to erasure</strong> — you
              can request deletion of any personal data you provided.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-emerald-500 mt-0.5 shrink-0">•</span>
            <span>
              <strong className="text-gray-300">Right to rectification</strong>{" "}
              — you can request correction of inaccurate data.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-emerald-500 mt-0.5 shrink-0">•</span>
            <span>
              <strong className="text-gray-300">Right to object</strong> — you
              can object to processing at any time.
            </span>
          </li>
        </ul>
      ),
    },
    {
      icon: Trash2,
      title: "Data retention",
      content: (
        <p className="text-left text-sm text-gray-400 leading-relaxed">
          Contact form messages are kept only as long as necessary to respond to
          your inquiry and are then deleted. Server logs are deleted
          automatically within a few days. No personal data is stored in a
          database on this website.
        </p>
      ),
    },
    {
      icon: Mail,
      title: "Contact & responsible party",
      content: (
        <div className="space-y-2">
          <p className="text-left text-sm text-gray-500 mb-3">
            The person responsible for data processing on this website:
          </p>
          <div className="flex items-center gap-3 px-3 py-2.5 bg-white/3 border border-white/6 rounded-xl">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
              <Shield className="w-3.5 h-3.5" />
            </div>
            <div>
              <p className="text-left text-xs text-gray-600 leading-none mb-0.5">
                Name
              </p>
              <p className="text-sm font-medium text-white">Bastian</p>
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
    <div className="min-h-screen bg-[#0a0a0a] text-white py-24 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/8 bg-white/4 text-xs text-gray-400 font-medium tracking-wide mb-5">
            <Shield className="w-3 h-3 text-emerald-400" />
            DSGVO / GDPR
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-white mb-3">
            Privacy Policy
          </h1>
          <p className="text-gray-500 text-sm leading-relaxed">
            How this website handles your data — short, honest and without
            legalese.
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

        {/* Bottom note */}
        <p className="text-center text-xs text-gray-700 mt-8">
          This privacy policy applies to{" "}
          <span className="text-gray-600">bbastian.dev</span>, all subpages and
          all subdomains.
        </p>
      </div>
    </div>
  );
}
