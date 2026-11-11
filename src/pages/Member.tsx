import PageHeader from "../components/PageHeader"
import PortalShell, { PortalCard, usePortalTab, type PortalGroup } from "../components/PortalShell"
import CalendarView from "../components/views/CalendarView"
import DocumentListView from "../components/views/DocumentListView"
import SocialFeedView from "../components/views/SocialFeedView"
import CompetitionsView from "../components/views/CompetitionsView"
import UpcomingList from "../components/views/UpcomingList"
import LinkCard from "../components/views/LinkCard"
import AccountSettings from "../components/member/AccountSettings"
import { useSession, displayName } from "../lib/useSession"
import { supabase } from "../lib/supabase"
import { SITE } from "../data/site"

const GROUPS: PortalGroup[] = [
  {
    heading: "Dashboard",
    items: [{ key: "overview", label: "Overview", description: "What's coming up and the things members use most." }],
  },
  {
    heading: "Club",
    items: [
      { key: "calendar", label: "Calendar", description: "Meetings and competition deadlines. All times Eastern." },
      { key: "competitions", label: "Competitions", description: "Every competition YEFA is tracking this year." },
      { key: "social", label: "Social Media", description: "The latest posts from YEFA's Instagram." },
    ],
  },
  {
    heading: "Take part",
    items: [
      { key: "points", label: "Points", description: "Went to a meeting, competed, or helped out? Log it and officers add it to the points sheet." },
      { key: "forms", label: "Forms", description: "Sign-ups and submissions for members." },
      { key: "resources", label: "Resources", description: "Study guides, prep material and links." },
    ],
  },
  {
    heading: "You",
    items: [{ key: "account", label: "Account", description: "Your name, password and account." }],
  },
]

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
        <h3 className="mb-5 text-xl font-bold">Quick actions</h3>
        <div className="space-y-3">
          <LinkCard
            href={SITE.pointsForm}
            title="Log points"
            description="Record a meeting, competition or event you took part in."
          />
          <LinkCard href={SITE.econBowlForm} title="Econ Bowl sign-up" description="Sign up to compete in the Econ Bowl." />
          <PortalCard title="Resources" description="Study guides, prep material and links." onClick={() => go("resources")} />
        </div>
      </div>
    </div>
  )
}

function FormsTab() {
  return (
    <div className="space-y-3">
      <LinkCard
        href={SITE.pointsForm}
        title="Points Form"
        description="Log a meeting, competition, or event you took part in."
      />
      <LinkCard href={SITE.econBowlForm} title="Econ Bowl Sign-Up" description="Sign up to compete in the Econ Bowl." />
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
  const { active, select } = usePortalTab(GROUPS)
  const tab = active.key

  return (
    <div>
      <PageHeader title={name ? `Welcome, ${name}` : "Member Portal"} subtitle={`Signed in as ${email}`} />

      <PortalShell
        groups={GROUPS}
        active={active}
        onSelect={select}
        actions={[{ label: "Sign out", onClick: () => supabase.auth.signOut() }]}
      >
        {tab === "overview" && <Overview go={select} />}
        {tab === "calendar" && <CalendarView />}
        {tab === "competitions" && <CompetitionsView />}
        {tab === "social" && <SocialFeedView />}
        {tab === "points" && (
          <div className="max-w-xl">
            <LinkCard
              href={SITE.pointsForm}
              title="Points Form"
              description="Log a meeting, competition, or event you took part in."
            />
          </div>
        )}
        {tab === "forms" && <FormsTab />}
        {tab === "resources" && (
          <DocumentListView
            section="resources"
            emptyTitle="Resources coming soon."
            emptyBody="Study guides, prep materials, and links will live here."
          />
        )}
        {tab === "account" && session && <AccountSettings user={session.user} />}
      </PortalShell>
    </div>
  )
}
