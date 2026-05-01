import {
  Shield,
  Mail,
  FileText,
  Trash2,
  Eye,
  Server,
  MapPin,
  Cpu,
  CreditCard,
  Mic,
  Globe,
} from "lucide-react";

const CONTACT_EMAIL = "hello@bbastian.dev";
const LAST_UPDATED = "1. Mai 2026";

interface Section {
  icon: React.ElementType;
  title: string;
  content: React.ReactNode;
}

export default function NouryPrivacy() {
  const sections: Section[] = [
    {
      icon: FileText,
      title: "What data we collect",
      content: (
        <ul className="space-y-3 text-sm text-gray-400 leading-relaxed">
          {[
            {
              label: "Account & contact",
              detail:
                "Your e-mail address is collected when you create an account. It is used exclusively for authentication and account recovery.",
            },
            {
              label: "Health & fitness data",
              detail:
                "Meals, calorie counts, macronutrients (protein, carbs, fat), and body weight you enter are stored to power the core features of the app. This data may constitute health-related personal data under Art. 9 GDPR and is processed exclusively to provide the app's functionality.",
            },
            {
              label: "Meal photos",
              detail:
                "Photos you take or upload for meal scanning are sent to Google Gemini for AI analysis and optionally stored in your account.",
            },
            {
              label: "Voice recordings",
              detail:
                "Audio recorded via the Voice Log feature is sent to Google Gemini for transcription and meal estimation. Recordings are not stored after processing.",
            },
            {
              label: "User identifier",
              detail:
                "A unique user ID is assigned to your account and used to associate your data with your profile.",
            },
            {
              label: "Purchase history",
              detail:
                "Subscription and purchase data is processed by RevenueCat to verify your plan status. We do not store raw payment information.",
            },
            {
              label: "Push notification token",
              detail:
                "If you enable notifications, a device push token is saved to deliver meal reminders and streak alerts.",
            },
            {
              label: "Server logs",
              detail:
                "Our server infrastructure may temporarily log your IP address, request timestamps, and basic technical metadata for security, abuse prevention, and stability purposes. These logs are not used for profiling and are deleted automatically within a short period.",
            },
          ].map(({ label, detail }) => (
            <li key={label} className="text-left flex gap-2">
              <span className="text-emerald-500 mt-0.5 shrink-0">•</span>
              <span>
                <strong className="text-gray-300">{label}</strong> — {detail}
              </span>
            </li>
          ))}
        </ul>
      ),
    },
    {
      icon: Eye,
      title: "Purpose & legal basis of processing",
      content: (
        <div className="space-y-3">
          <ul className="space-y-2 text-sm text-gray-400 leading-relaxed">
            {[
              "Providing and personalising the app's core features (calorie tracking, AI analysis, coach).",
              "Managing your subscription and verifying access to premium features.",
              "Sending optional push notifications you have explicitly enabled.",
              "Routing meal data through Google Gemini to generate AI-based nutritional estimates.",
            ].map((item) => (
              <li key={item} className="text-left flex gap-2">
                <span className="text-emerald-500 mt-0.5 shrink-0">•</span>
                <span>{item}</span>
              </li>
            ))}
            <li className="text-left flex gap-2 mt-1">
              <span className="text-emerald-500 mt-0.5 shrink-0">•</span>
              <span>
                <strong className="text-gray-300">No advertising.</strong> Your
                data is never sold or shared with ad networks.
              </span>
            </li>
          </ul>
          <div className="mt-3 p-3 rounded-xl bg-white/3 border border-white/8 space-y-2">
            <p className="text-xs font-semibold text-gray-400 mb-2">Legal basis (GDPR Art. 6)</p>
            {[
              {
                article: "Art. 6(1)(b)",
                label: "Contract performance",
                desc: "Processing your account, meal, and subscription data is necessary to provide the Service you signed up for.",
              },
              {
                article: "Art. 6(1)(a)",
                label: "Consent",
                desc: "Push notifications are only sent based on your explicit opt-in. You can withdraw consent at any time in your device settings.",
              },
              {
                article: "Art. 6(1)(f)",
                label: "Legitimate interest",
                desc: "Server logs and IP addresses are processed to ensure security, detect abuse, and maintain technical stability.",
              },
            ].map(({ article, label, desc }) => (
              <div key={article} className="flex gap-2 text-xs text-left">
                <span className="shrink-0 font-mono text-emerald-500/80 mt-0.5">{article}</span>
                <span className="text-gray-500">
                  <strong className="text-gray-400">{label}</strong> — {desc}
                </span>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      icon: Server,
      title: "Hosting & infrastructure",
      content: (
        <ul className="space-y-2 text-sm text-gray-400 leading-relaxed">
          {[
            "User data (meals, profile, weight logs) is stored on Supabase — a PostgreSQL backend with servers in the EU (Frankfurt, Germany).",
            "Meal photos are stored in Supabase Storage (EU region).",
            "Row-level security (RLS) ensures each user can only access their own data.",
            "Server infrastructure may log IP addresses and request metadata temporarily for security and abuse prevention purposes (legal basis: Art. 6(1)(f) GDPR). These logs are deleted automatically and are never used for profiling.",
          ].map((item) => (
            <li key={item} className="text-left flex gap-2">
              <span className="text-emerald-500 mt-0.5 shrink-0">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      ),
    },
    {
      icon: Cpu,
      title: "Third-party services",
      content: (
        <div className="space-y-2">
          {[
            {
              name: "Google Gemini",
              role: "AI analysis",
              icon: Cpu,
              accent: "text-blue-400",
              bg: "bg-blue-500/8",
              border: "border-blue-500/15",
              detail:
                "Meal photos, voice audio, and recipe text are sent to the Gemini API for analysis. Voice recordings are discarded immediately after the response is returned.",
            },
            {
              name: "RevenueCat",
              role: "Subscriptions",
              icon: CreditCard,
              accent: "text-violet-400",
              bg: "bg-violet-500/8",
              border: "border-violet-500/15",
              detail:
                "Handles in-app purchase verification. Receives your Apple-issued receipt and assigns a subscriber ID. No raw card data is ever processed.",
            },
            {
              name: "Expo",
              role: "Push notifications",
              icon: Mic,
              accent: "text-orange-400",
              bg: "bg-orange-500/8",
              border: "border-orange-500/15",
              detail:
                "Your device push token is stored only when you enable notifications, and used solely to deliver your chosen reminders.",
            },
            {
              name: "Supabase",
              role: "Backend & storage",
              icon: Server,
              accent: "text-emerald-400",
              bg: "bg-emerald-500/8",
              border: "border-emerald-500/15",
              detail:
                "All user data (meals, profile, photos) is stored on Supabase servers in Frankfurt, EU. Row-level security ensures only you can access your data.",
            },
          ].map(({ name, role, icon: Icon, accent, bg, border, detail }) => (
            <div key={name} className={`flex gap-3 p-4 rounded-xl ${bg} border ${border}`}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-white/5">
                <Icon className={`w-4 h-4 ${accent}`} />
              </div>
              <div className="flex-1 min-w-0 text-left">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-semibold text-gray-200">{name}</p>
                  <span className={`inline-flex items-center text-[10px] font-semibold px-3 py-1.5 rounded-full bg-white/5 ${accent}`}>
                    {role}
                  </span>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed text-left">{detail}</p>
              </div>
            </div>
          ))}
        </div>
      ),
    },
    {
      icon: Globe,
      title: "International data transfers",
      content: (
        <div className="space-y-3 text-sm text-gray-400 leading-relaxed">
          <p className="text-left">
            Some third-party services used by Noury may transfer or process data
            outside the European Economic Area (EEA):
          </p>
          <ul className="space-y-2">
            {[
              "Google Gemini (Google LLC, USA) — processes meal photos, audio, and text on US-based infrastructure. Google participates in the EU–US Data Privacy Framework and uses Standard Contractual Clauses (SCCs) as a transfer safeguard.",
              "RevenueCat (RevenueCat, Inc., USA) — processes purchase receipts on US infrastructure, covered by their data processing agreement and SCCs.",
              "Expo (Expo Technology, Inc., USA) — push notification tokens may be processed via US infrastructure.",
            ].map((item) => (
              <li key={item} className="text-left flex gap-2">
                <span className="text-emerald-500 mt-0.5 shrink-0">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="text-left text-xs text-gray-500">
            Where transfers occur, appropriate safeguards are in place as required by Art. 46 GDPR (Standard Contractual Clauses or equivalent adequacy decisions).
          </p>
        </div>
      ),
    },
    {
      icon: Shield,
      title: "Your rights (DSGVO / GDPR)",
      content: (
        <ul className="space-y-2 text-sm text-gray-400 leading-relaxed text-left">
          {[
            {
              right: "Right of access",
              desc: "Request a copy of all personal data we hold about you.",
            },
            {
              right: "Right to erasure",
              desc: 'Delete your account and all associated data from within the app (Settings → "Delete account") or by contacting us.',
            },
            {
              right: "Right to rectification",
              desc: "Correct inaccurate personal data (name, email) via the app settings at any time.",
            },
            {
              right: "Right to data portability",
              desc: "Request an export of your meal and health data in a machine-readable format.",
            },
            {
              right: "Right to object",
              desc: "Object to any processing based on legitimate interest (Art. 6(1)(f) GDPR) at any time.",
            },
            {
              right: "Right to withdraw consent",
              desc: "Where processing is based on consent (e.g. push notifications), you can withdraw it at any time without affecting prior processing.",
            },
            {
              right: "Right to lodge a complaint",
              desc: "You have the right to lodge a complaint with your local supervisory authority. In Austria: Datenschutzbehörde (dsb.gv.at).",
            },
          ].map(({ right, desc }) => (
            <li key={right} className="flex gap-2">
              <span className="text-emerald-500 mt-0.5 shrink-0">•</span>
              <span>
                <strong className="text-gray-300">{right}</strong> — {desc}
              </span>
            </li>
          ))}
        </ul>
      ),
    },
    {
      icon: Trash2,
      title: "Data retention",
      content: (
        <ul className="space-y-2 text-sm text-gray-400 leading-relaxed">
          {[
            "Meal, fitness, and profile data is retained for as long as your account is active.",
            "Voice recordings are processed in real time and are not stored after the Gemini API call.",
            "Server logs are deleted automatically within a short period and are not retained beyond operational necessity.",
            "Upon account deletion, all personal data is permanently removed within 30 days.",
            "Purchase records may be retained as required by Austrian tax law (7 years).",
          ].map((item) => (
            <li key={item} className="text-left flex gap-2">
              <span className="text-emerald-500 mt-0.5 shrink-0">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      ),
    },
    {
      icon: Mail,
      // TODO: Replace "Bastian" with your full legal name, business name, and postal address
      // before submitting to app stores or publishing this policy.
      title: "Contact & responsible party",
      content: (
        <div className="space-y-2">
          <p className="text-left text-sm text-gray-500 mb-3">
            The person responsible for data processing within the Noury app
            (Art. 4(7) GDPR):
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
            Noury · DSGVO / GDPR
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-white mb-3">
            Privacy Policy
          </h1>
          <p className="text-gray-500 text-sm leading-relaxed max-w-md mx-auto">
            How the Noury app handles your health and account data — transparent
            and without legalese.
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

        {/* Bottom links */}
        <div className="flex items-center justify-center gap-4 mt-8">
          <a
            href="/noury/terms"
            className="text-xs text-gray-600 hover:text-emerald-400 transition-colors"
          >
            Terms of Service →
          </a>
          <span className="text-gray-800">·</span>
          <a
            href="/noury"
            className="text-xs text-gray-600 hover:text-gray-400 transition-colors"
          >
            Back to Noury
          </a>
        </div>
        <p className="text-center text-xs text-gray-700 mt-3">
          This privacy policy applies to the Noury iOS app and{" "}
          <span className="text-gray-600">bbastian.dev/noury</span> and all
          related subpages.
        </p>
      </div>
    </div>
  );
}
