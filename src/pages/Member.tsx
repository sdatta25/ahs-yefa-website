import { useState } from "react"
import PageHeader from "../components/PageHeader"
import CalendarView from "../components/views/CalendarView"
import DocumentListView from "../components/views/DocumentListView"
import SocialFeedView from "../components/views/SocialFeedView"
import CompetitionsView from "../components/views/CompetitionsView"
import LinkCard from "../components/views/LinkCard"
import { useSession, displayName } from "../lib/useSession"
import { supabase } from "../lib/supabase"
import { SITE } from "../data/site"

const TABS = [
  { key: "calendar", label: "Calendar" },
  { key: "points", label: "Points" },
  { key: "resources", label: "Resources" },
  { key: "competitions", label: "Competitions" },
  { key: "social", label: "Social Media" },
  { key: "forms", label: "Forms" },
] as const

type TabKey = (typeof TABS)[number]["key"]

function PointsTab() {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
      <h2 className="text-lg font-semibold text-yefa-navy">Earn points for YEFA activities.</h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-yefa-ink">
        Went to a meeting, competed, or helped out? Log it with the Points Form and officers will add
        it to the points sheet.
      </p>
      <a
        href={SITE.pointsForm}
        target="_blank"
        rel="noreferrer"
        className="mt-6 inline-block rounded-lg bg-yefa-blue px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-yefa-blue-dark"
      >
        Open the Points Form
      </a>
    </div>
  )
}

function FormsTab() {
  return (
    <div className="space-y-4">
      <LinkCard
        href={SITE.pointsForm}
        title="Points Form"
        description="Log a meeting, competition, or event you took part in."
      />
      <LinkCard
        href={SITE.memberSignupForm}
        title="Membership Sign-Up"
        description="Share this with a friend who wants to join YEFA."
      />
    </div>
  )
}

export default function Member() {
  const { session } = useSession()
  const email = session?.user.email ?? ""
  const name = displayName(session?.user)
  const [tab, setTab] = useState<TabKey>("calendar")

  return (
    <div>
      <PageHeader title={name ? `Welcome, ${name}!` : "Member Portal"} subtitle={`Signed in as ${email}`} />

      <section className="mx-auto max-w-5xl px-5 py-12">
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
          <button
            onClick={() => supabase.auth.signOut()}
            className="shrink-0 rounded-lg px-4 py-2 text-sm font-semibold text-yefa-ink ring-1 ring-inset ring-slate-300 transition hover:bg-slate-50"
          >
            Sign out
          </button>
        </div>

        {tab === "calendar" && <CalendarView />}
        {tab === "points" && <PointsTab />}
        {tab === "resources" && (
          <DocumentListView
            section="resources"
            emptyTitle="Resources coming soon."
            emptyBody="Study guides, prep materials, and links will live here."
          />
        )}
        {tab === "competitions" && <CompetitionsView />}
        {tab === "social" && <SocialFeedView />}
        {tab === "forms" && <FormsTab />}
      </section>
    </div>
  )
}
