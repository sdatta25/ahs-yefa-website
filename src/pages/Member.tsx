import { useState } from "react"
import PageHeader from "../components/PageHeader"
import CalendarView from "../components/views/CalendarView"
import DocumentListView from "../components/views/DocumentListView"
import SocialFeedView from "../components/views/SocialFeedView"
import CompetitionsView from "../components/views/CompetitionsView"
import { useSession } from "../lib/useSession"
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
      <h2 className="text-lg font-semibold text-yefa-navy">Points tracking is coming soon.</h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-yefa-ink">
        Submit the Points Form below for now — your running total, and whether each submission has
        been approved, will show up here once it's wired in.
      </p>
      <a
        href="https://docs.google.com/forms/d/e/1FAIpQLSeH1X8mb9AURMvHldkyc6kSoFuMypFYzIxQZkBeJy2XGrfdSA/viewform"
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
      <a
        href="https://docs.google.com/forms/d/e/1FAIpQLSeH1X8mb9AURMvHldkyc6kSoFuMypFYzIxQZkBeJy2XGrfdSA/viewform"
        target="_blank"
        rel="noreferrer"
        className="group block rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-0.5 hover:border-yefa-blue/30 hover:shadow-[0_18px_30px_-18px_rgba(16,20,43,0.25)]"
      >
        <h3 className="text-lg font-semibold text-yefa-navy">Points Form</h3>
        <p className="mt-1 text-sm text-yefa-ink">Log a point opportunity for officer approval.</p>
        <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-yefa-blue">
          Open form
          <span className="transition-transform group-hover:translate-x-1">&rarr;</span>
        </span>
      </a>
      <a
        href={SITE.memberSignupForm}
        target="_blank"
        rel="noreferrer"
        className="group block rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-0.5 hover:border-yefa-blue/30 hover:shadow-[0_18px_30px_-18px_rgba(16,20,43,0.25)]"
      >
        <h3 className="text-lg font-semibold text-yefa-navy">Membership Sign-Up</h3>
        <p className="mt-1 text-sm text-yefa-ink">Share this with a friend who wants to join YEFA.</p>
        <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-yefa-blue">
          Open form
          <span className="transition-transform group-hover:translate-x-1">&rarr;</span>
        </span>
      </a>
    </div>
  )
}

export default function Member() {
  const { session } = useSession()
  const email = session?.user.email ?? ""
  const [tab, setTab] = useState<TabKey>("calendar")

  return (
    <div>
      <PageHeader title="Member Portal" subtitle={`Signed in as ${email}`} />

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
