import { useState } from "react"
import AuthGate from "../components/admin/AuthGate"
import EventManager from "../components/admin/EventManager"
import DocumentManager from "../components/admin/DocumentManager"

const TABS = [
  { key: "events", label: "Meetings & Competitions" },
  { key: "forms", label: "Forms" },
  { key: "resources", label: "Resources" },
  { key: "social", label: "Social Media" },
] as const

type TabKey = (typeof TABS)[number]["key"]

export default function Admin() {
  const [tab, setTab] = useState<TabKey>("events")

  return (
    <div>
      <div className="border-b border-white/10 bg-yefa-navy px-5 py-12 text-white">
        <div className="mx-auto max-w-5xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-yefa-orange-light">Officers Only</p>
          <h1 className="mt-2 text-3xl font-bold">Admin</h1>
          <p className="mt-2 text-slate-300">
            Manage the calendar, sign-up forms, resources, and social post previews. Changes go live immediately.
          </p>
        </div>
      </div>

      <section className="mx-auto max-w-5xl px-5 py-12">
        <AuthGate>
          <div className="mb-8 flex gap-1 overflow-x-auto rounded-full bg-slate-100 p-1">
            {TABS.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition ${
                  tab === t.key ? "bg-white text-yefa-blue shadow-sm" : "text-yefa-ink hover:text-yefa-blue"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {tab === "events" && <EventManager />}
          {tab === "forms" && <DocumentManager section="forms" label="Forms" />}
          {tab === "resources" && <DocumentManager section="resources" label="Resources" />}
          {tab === "social" && <DocumentManager section="social" label="Social Media" />}
        </AuthGate>
      </section>
    </div>
  )
}
