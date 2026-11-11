import type { ReactNode } from "react"
import { Link, useSearchParams } from "react-router-dom"

export type PortalItem = { key: string; label: string; title?: string; description?: string }
export type PortalGroup = { heading: string; items: PortalItem[] }
export type PortalAction = { label: string; to?: string; onClick?: () => void }

// The open section lives in the address (?tab=points), so a reload or the
// back button keeps your place.
export function usePortalTab(groups: PortalGroup[]) {
  const [params, setParams] = useSearchParams()
  const items = groups.flatMap((g) => g.items)
  const active = items.find((i) => i.key === params.get("tab")) ?? items[0]
  const select = (key: string) => setParams(key === items[0].key ? {} : { tab: key })
  return { active, select }
}

function ActionButton({ action, className }: { action: PortalAction; className: string }) {
  return action.to ? (
    <Link to={action.to} className={className}>
      {action.label}
    </Link>
  ) : (
    <button onClick={action.onClick} className={className}>
      {action.label}
    </button>
  )
}

// Shared layout for the signed-in areas: grouped sidebar on desktop, a
// scrolling tab row on phones, and a titled header above each section.
export default function PortalShell({
  groups,
  active,
  onSelect,
  actions = [],
  children,
}: {
  groups: PortalGroup[]
  active: PortalItem
  onSelect: (key: string) => void
  actions?: PortalAction[]
  children: ReactNode
}) {
  const items = groups.flatMap((g) => g.items)

  return (
    <div className="mx-auto max-w-7xl px-5 lg:grid lg:grid-cols-[13.5rem_minmax(0,1fr)] lg:gap-12">
      {/* Phones and tablets: one scrolling row of tabs */}
      <nav aria-label="Sections" className="-mx-5 overflow-x-auto border-b border-yefa-rule px-5 lg:hidden">
        <div className="flex w-max gap-1">
          {items.map((item) => (
            <button
              key={item.key}
              onClick={() => onSelect(item.key)}
              aria-current={item.key === active.key ? "page" : undefined}
              className={`-mb-px whitespace-nowrap border-b-2 px-3 py-3.5 text-sm font-semibold transition-colors ${
                item.key === active.key
                  ? "border-yefa-blue text-yefa-blue"
                  : "border-transparent text-yefa-ink hover:text-yefa-navy"
              }`}
            >
              {item.label}
            </button>
          ))}
          {actions.map((a) => (
            <ActionButton
              key={a.label}
              action={a}
              className="-mb-px whitespace-nowrap border-b-2 border-transparent px-3 py-3.5 text-sm font-semibold text-yefa-ink hover:text-yefa-navy"
            />
          ))}
        </div>
      </nav>

      {/* Desktop: grouped sidebar */}
      <aside className="hidden lg:block">
        <nav aria-label="Sections" className="sticky top-24 space-y-7 py-12">
          {groups.map((group) => (
            <div key={group.heading}>
              <p className="px-3 text-xs font-semibold text-yefa-ink">{group.heading}</p>
              <ul className="mt-2 space-y-0.5">
                {group.items.map((item) => (
                  <li key={item.key}>
                    <button
                      onClick={() => onSelect(item.key)}
                      aria-current={item.key === active.key ? "page" : undefined}
                      className={`w-full rounded-md px-3 py-2 text-left text-sm transition-colors ${
                        item.key === active.key
                          ? "bg-yefa-navy font-semibold text-white"
                          : "font-medium text-yefa-navy hover:bg-white"
                      }`}
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          {actions.length > 0 && (
            <div className="space-y-2 border-t border-yefa-rule pt-6">
              {actions.map((a) => (
                <ActionButton
                  key={a.label}
                  action={a}
                  className="block w-full rounded-md px-3 py-2 text-left text-sm font-medium text-yefa-ink ring-1 ring-inset ring-yefa-rule transition-colors hover:bg-white hover:text-yefa-navy"
                />
              ))}
            </div>
          )}
        </nav>
      </aside>

      <section className="min-w-0 py-10 lg:py-12">
        <header className="mb-8 border-b border-yefa-rule pb-6">
          <h2 className="text-2xl font-bold sm:text-3xl">{active.title ?? active.label}</h2>
          {active.description && <p className="mt-2 max-w-2xl leading-relaxed text-yefa-ink">{active.description}</p>}
        </header>
        {children}
      </section>
    </div>
  )
}

// A card that jumps to another section of the portal.
export function PortalCard({ title, description, onClick }: { title: string; description: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="group block w-full rounded-md border border-yefa-rule bg-white p-5 text-left transition-colors hover:border-yefa-blue/50"
    >
      <span className="block text-lg font-semibold text-yefa-navy">{title}</span>
      <span className="mt-1 block text-sm text-yefa-ink">{description}</span>
      <span className="mt-3 inline-block text-sm font-semibold text-yefa-blue group-hover:underline">Open</span>
    </button>
  )
}
