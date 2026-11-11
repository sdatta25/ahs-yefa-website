import AuthGate from "../components/admin/AuthGate"
import PageHeader from "../components/PageHeader"
import PortalShell, { usePortalTab, type PortalGroup } from "../components/PortalShell"
import EventManager from "../components/admin/EventManager"
import DocumentManager from "../components/admin/DocumentManager"

const GROUPS: PortalGroup[] = [
  {
    heading: "Website content",
    items: [
      {
        key: "events",
        label: "Calendar",
        description: "Add, edit and delete meetings and competition deadlines. Times are Eastern.",
      },
      {
        key: "forms",
        label: "Forms",
        description: "Sign-up forms shown on the Forms page. Drag to reorder.",
      },
      {
        key: "resources",
        label: "Resources",
        description: "Guides and links shown on the Resources page. Drag to reorder.",
      },
      {
        key: "social",
        label: "Social Media",
        description: "Instagram post previews. Drag to reorder.",
      },
    ],
  },
]

export default function Admin() {
  const { active, select } = usePortalTab(GROUPS)
  const tab = active.key

  return (
    <div>
      <AuthGate header={<PageHeader tone="dark" title="Admin" subtitle="Edit the public website. Changes go live right away." />}>
        {(logout) => (
          <PortalShell
            groups={GROUPS}
            active={active}
            onSelect={select}
            actions={[
              { label: "Officer Portal", to: "/officer" },
              { label: "Log out", onClick: logout },
            ]}
          >
            {tab === "events" && <EventManager />}
            {tab === "forms" && <DocumentManager section="forms" label="Forms" />}
            {tab === "resources" && <DocumentManager section="resources" label="Resources" />}
            {tab === "social" && <DocumentManager section="social" label="Social Media" />}
          </PortalShell>
        )}
      </AuthGate>
    </div>
  )
}
