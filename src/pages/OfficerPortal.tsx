import { useState } from "react"
import { Link } from "react-router-dom"
import AuthGate from "../components/admin/AuthGate"
import PageHeader from "../components/PageHeader"
import PortalShell, { PortalCard, usePortalTab, type PortalGroup } from "../components/PortalShell"
import UpcomingList from "../components/views/UpcomingList"
import SheetPreview from "../components/admin/SheetPreview"
import CalendarView from "../components/views/CalendarView"
import DocumentListView from "../components/views/DocumentListView"
import SocialFeedView from "../components/views/SocialFeedView"
import CompetitionsView from "../components/views/CompetitionsView"
import LinkCard from "../components/views/LinkCard"
import { OFFICERS, type Officer } from "../data/officers"
import { SITE } from "../data/site"

const NAME_KEY = "yefa_officer_name"

const GROUPS: PortalGroup[] = [
  {
    heading: "Dashboard",
    items: [{ key: "overview", label: "Overview", description: "What's coming up and the officer tools." }],
  },
  {
    heading: "Team",
    items: [
      { key: "points", label: "Points", description: "Read-only preview of the Points Form responses. Edit points in Google Sheets." },
      { key: "members", label: "Members", description: "Read-only preview of the membership sign-up responses." },
    ],
  },
  {
    heading: "Club",
    items: [
      { key: "calendar", label: "Calendar", description: "Meetings and competition deadlines. All times Eastern." },
      { key: "forms", label: "Forms", description: "The forms members fill out." },
      { key: "resources", label: "Resources", description: "What members see under Resources." },
      { key: "competitions", label: "Competitions", description: "Every competition YEFA is tracking this year." },
      { key: "social", label: "Social Media", description: "The latest posts from YEFA's Instagram." },
    ],
  },
]

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
            className="flex items-center gap-3 rounded-md border border-yefa-rule bg-white p-3 text-left transition hover:border-yefa-blue/40 hover:shadow-sm"
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

function Overview({ go }: { go: (key: string) => void }) {
  return (
    <div className="grid gap-12 xl:grid-cols-2">
      <div>
        <div className="mb-5 flex items-baseline justify-between gap-4">
          <h3 className="text-xl font-bold">Next up</h3>
          <button onClick={() => go("calendar")} className="text-sm font-semibold text-yefa-blue hover:underline">
            Full calendar
          </button>
        </div>
        <UpcomingList limit={3} />
      </div>
      <div>
        <h3 className="mb-5 text-xl font-bold">Officer tools</h3>
        <div className="space-y-3">
          <PortalCard title="Points" description="See the Points Form responses." onClick={() => go("points")} />
          <PortalCard title="Members" description="See who has signed up." onClick={() => go("members")} />
          <Link
            to="/admin"
            className="group block rounded-md border border-yefa-rule bg-white p-5 transition-colors hover:border-yefa-blue/50"
          >
            <span className="block text-lg font-semibold text-yefa-navy">Edit the website</span>
            <span className="mt-1 block text-sm text-yefa-ink">Add meetings, forms, resources and social posts in Admin.</span>
            <span className="mt-3 inline-block text-sm font-semibold text-yefa-blue group-hover:underline">Open Admin</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

function Dashboard({ logout }: { logout: () => void }) {
  const { active, select } = usePortalTab(GROUPS)
  const tab = active.key

  return (
    <PortalShell
      groups={GROUPS}
      active={active}
      onSelect={select}
      actions={[
        { label: "Edit website (Admin)", to: "/admin" },
        { label: "Log out", onClick: logout },
      ]}
    >
      {tab === "overview" && <Overview go={select} />}
      {tab === "points" && <SheetPreview field="pointsSheetUrl" title="Points" />}
      {tab === "members" && <SheetPreview field="membersSheetUrl" title="Members" />}
      {tab === "calendar" && <CalendarView />}
      {tab === "forms" && (
        <div className="space-y-3">
          <LinkCard href={SITE.pointsForm} title="Points Form" description="The form members use to log points." />
          <LinkCard
            href={SITE.econBowlForm}
            title="Econ Bowl Sign-Up"
            description="The form members use to sign up for the Econ Bowl."
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
    </PortalShell>
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
      <PageHeader
        title={officer ? `Welcome, ${officer.name}` : "Officer Portal"}
        subtitle={
          officer ? (
            <>
              {officer.position}.{" "}
              <button onClick={forget} className="font-semibold text-yefa-blue hover:underline">
                Not you?
              </button>
            </>
          ) : (
            "Points, members and everything else officers need in one place."
          )
        }
      />

      <AuthGate onLogout={forget}>
        {(logout) =>
          officer ? (
            <Dashboard logout={logout} />
          ) : (
            <div className="px-5 py-12">
              <WhoAreYou onPick={pick} />
            </div>
          )
        }
      </AuthGate>
    </div>
  )
}
