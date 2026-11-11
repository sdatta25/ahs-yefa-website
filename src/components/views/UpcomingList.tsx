import { useEffect, useState } from "react"
import { fetchEvents, type EventItem } from "../../lib/api"
import { formatTime12h, todayISO } from "../../lib/date"

function dateParts(iso: string) {
  const [y, m, d] = iso.split("-").map(Number)
  const date = new Date(y, m - 1, d)
  return {
    month: date.toLocaleDateString("en-US", { month: "short" }),
    day: d,
    weekday: date.toLocaleDateString("en-US", { weekday: "long" }),
  }
}

// The next few meetings and competition deadlines, soonest first.
export default function UpcomingList({ limit = 3 }: { limit?: number }) {
  const [events, setEvents] = useState<EventItem[] | null>(null)

  useEffect(() => {
    fetchEvents()
      .then((all) => {
        const today = todayISO()
        setEvents(
          all
            .filter((e) => e.date >= today)
            .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))
            .slice(0, limit),
        )
      })
      .catch(() => setEvents([]))
  }, [limit])

  if (events === null) return <p className="text-yefa-ink">Loading the calendar…</p>

  if (events.length === 0) {
    return (
      <p className="max-w-md leading-relaxed text-yefa-ink">
        Nothing is scheduled yet. New meetings and competition deadlines go on the calendar as soon as
        they're set.
      </p>
    )
  }

  return (
    <ol className="divide-y divide-yefa-rule border-y border-yefa-rule">
      {events.map((e) => {
        const d = dateParts(e.date)
        return (
          <li key={e.id} className="flex gap-6 py-5">
            <div className="w-14 shrink-0 text-center">
              <div className="text-xs font-semibold text-yefa-ink">{d.month}</div>
              <div className="tabular font-display text-3xl font-extrabold leading-none [font-stretch:125%]">
                {d.day}
              </div>
            </div>
            <div>
              <p className="font-semibold">
                {e.title}
                {e.type === "competition" && (
                  <span className="ml-2 rounded bg-yefa-orange/15 px-1.5 py-0.5 align-middle text-xs font-semibold text-yefa-orange-ink">
                    Competition
                  </span>
                )}
              </p>
              <p className="mt-1 text-sm text-yefa-ink">
                {d.weekday}, {formatTime12h(e.time)}
                {e.location ? `, ${e.location}` : ""}
              </p>
            </div>
          </li>
        )
      })}
    </ol>
  )
}
