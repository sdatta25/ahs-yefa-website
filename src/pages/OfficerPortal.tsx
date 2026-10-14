import { useState } from "react"
import { Link } from "react-router-dom"
import AuthGate from "../components/admin/AuthGate"
import SheetPreview from "../components/admin/SheetPreview"
import CalendarView from "../components/views/CalendarView"
import DocumentListView from "../components/views/DocumentListView"
import SocialFeedView from "../components/views/SocialFeedView"
import CompetitionsView from "../components/views/CompetitionsView"
import LinkCard from "../components/views/LinkCard"
import { OFFICERS, type Officer } from "../data/officers"
import { SITE } from "../data/site"

const NAME_KEY = "yefa_officer_name"

const TABS = [
  { key: "points", label: "Points" },
  { key: "members", label: "Members" },
  { key: "calendar", label: "Calendar" },
  { key: "forms", label: "Forms" },
  { key: "resources", label: "Resources" },
  { key: "competitions", label: "Competitions" },
  { key: "social", label: "Social Media" },
] as const

type TabKey = (typeof TABS)[number]["key"]

function readStoredOfficer(): Officer | null {
  try {
    const name = localStorage.getItem(NAME_KEY)
    return OFFICERS.find((o) => o.name === name) ?? null
  } catch {
    return null
  }
}

// The officer login is shared by the whole team, so after signing in each
// officer picks who they are to get a personal view.
function WhoAreYou({ onPick }: { onPick: (o: Officer) => void }) {
  return (
    <div className="mx-auto max-w-2xl">
      <h2 className="text-center text-lg font-semibold text-yefa-navy">Who's signing in?</h2>
      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        {OFFICERS.map((o) => (
          <button
            key={o.name}
            onClick={() => onPick(o)}
            className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 text-left transition hover:border-yefa-blue/40 hover:shadow-sm"
          >
            {o.photo && <img src={o.photo} alt="" className="h-10 w-10 shrink-0 rounded-full object-cover" />}
            <span>
              <span className="block text-sm font-semibold text-yefa-navy">{o.name}</span>
              <span className="block text-xs text-yefa-ink">{o.position}</span>
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}

function Dashboard() {
  const [tab, setTab] = useState<TabKey>("points")

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex gap-1 overflow-x-auto rounded-full bg-slate-100 p-1">
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
        <Link
          to="/admin"
          className="shrink-0 rounded-lg px-4 py-2 text-sm font-semibold text-yefa-ink ring-1 ring-inset ring-slate-300 transition hover:bg-slate-50"
        >
          Edit website (Admin)
        </Link>
      </div>

      {tab === "points" && (
        <SheetPreview
          field="pointsSheetUrl"
          title="Points"
          description="Read-only preview of the Points Form responses spreadsheet. Edit points in Google Sheets."
        />
      )}
      {tab === "members" && (
        <SheetPreview
          field="membersSheetUrl"
          title="Members"
          description="Read-only preview of the membership sign-up spreadsheet."
        />
      )}
      {tab === "calendar" && <CalendarView />}
      {tab === "forms" && (
        <div className="space-y-4">
          <LinkCard
            href={SITE.pointsForm}
            title="Points Form"
            description="The form members use to log points."
          />
          <DocumentListView
            section="forms"
            emptyTitle="No other forms right now."
            emptyBody="Forms added in Admin show up here."
            openLabel="Open form"
          />
        </div>
      )}
      {tab === "resources" && (
        <DocumentListView
          section="resources"
          emptyTitle="No resources yet."
          emptyBody="Resources added in Admin show up here."
        />
      )}
      {tab === "competitions" && <CompetitionsView />}
      {tab === "social" && <SocialFeedView />}
    </div>
  )
}

export default function OfficerPortal() {
  const [officer, setOfficer] = useState<Officer | null>(readStoredOfficer)

  function pick(o: Officer) {
    try {
      localStorage.setItem(NAME_KEY, o.name)
    } catch {
      // Storage unavailable — the choice just won't be remembered.
    }
    setOfficer(o)
  }

  function forget() {
    try {
      localStorage.removeItem(NAME_KEY)
    } catch {
      // ignore
    }
    setOfficer(null)
  }

  return (
    <div>
      <div className="border-b border-white/10 bg-yefa-navy px-5 py-12 text-white">
        <div className="mx-auto max-w-5xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-yefa-orange-light">Officer Portal</p>
          <h1 className="mt-2 text-3xl font-bold">{officer ? `Welcome, ${officer.name}!` : "Officer Portal"}</h1>
          <p className="mt-2 text-slate-300">
            {officer ? (
              <>
                {officer.position} ·{" "}
                <button onClick={forget} className="underline decoration-slate-500 underline-offset-2 hover:text-white">
                  Not you?
                </button>
              </>
            ) : (
              "Points, members, and everything else officers need in one place."
            )}
          </p>
        </div>
      </div>

      <section className="mx-auto max-w-5xl px-5 py-12">
        <AuthGate onLogout={forget}>{officer ? <Dashboard /> : <WhoAreYou onPick={pick} />}</AuthGate>
      </section>
    </div>
  )
}
