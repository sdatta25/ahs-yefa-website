import { useEffect, useMemo, useRef, useState } from "react"
import EventCalendar from "../EventCalendar"
import { fetchEvents, type EventItem } from "../../lib/api"
import { formatDateLabel, formatTime12h, todayISO } from "../../lib/date"

const TYPE_STYLES: Record<EventItem["type"], string> = {
  meeting: "bg-yefa-blue/10 text-yefa-blue",
  competition: "bg-yefa-orange/10 text-yefa-orange",
}

const TYPE_LABEL: Record<EventItem["type"], string> = {
  meeting: "Meeting",
  competition: "Competition",
}

export default function CalendarView() {
  const [events, setEvents] = useState<EventItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selected, setSelected] = useState(todayISO())
  const [highlightId, setHighlightId] = useState<string | null>(null)
  const calendarRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchEvents()
      .then(setEvents)
      .catch(() => setError("Couldn't load the calendar right now. Try refreshing."))
      .finally(() => setLoading(false))
  }, [])

  const selectedEvents = useMemo(
    () => events.filter((e) => e.date === selected).sort((a, b) => a.time.localeCompare(b.time)),
    [events, selected],
  )

  const upcoming = useMemo(() => {
    const today = todayISO()
    return events
      .filter((e) => e.date >= today)
      .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))
      .slice(0, 5)
  }, [events])

  function jumpToEvent(e: EventItem) {
    setSelected(e.date)
    setHighlightId(e.id)
    calendarRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
    window.setTimeout(() => setHighlightId(null), 1800)
  }

  return (
    <>
      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {loading ? (
        <p className="text-sm text-yefa-ink">Loading calendar&hellip;</p>
      ) : (
        <div ref={calendarRef} className="grid scroll-mt-20 gap-8 lg:grid-cols-[1fr_1fr]">
          <EventCalendar events={events} selected={selected} onSelect={setSelected} />

          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <h3 className="text-base font-semibold text-yefa-navy">{formatDateLabel(selected)}</h3>

            {selectedEvents.length === 0 ? (
              <p className="mt-4 text-sm text-yefa-ink">None.</p>
            ) : (
              <ul className="mt-4 space-y-3">
                {selectedEvents.map((e) => (
                  <li
                    key={e.id}
                    className={`rounded-xl border p-4 transition-colors ${
                      e.id === highlightId ? "border-yefa-blue bg-yefa-blue-50" : "border-slate-200"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${TYPE_STYLES[e.type]}`}>
                        {TYPE_LABEL[e.type]}
                      </span>
                      <span className="text-xs font-semibold text-yefa-ink">{formatTime12h(e.time)}</span>
                    </div>
                    <h4 className="mt-2 font-semibold text-yefa-navy">{e.title}</h4>
                    {e.location && <p className="mt-0.5 text-sm text-yefa-ink">{e.location}</p>}
                    {e.description && <p className="mt-1 text-sm text-yefa-ink">{e.description}</p>}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {!loading && upcoming.length > 0 && (
        <div className="mt-12">
          <h2 className="text-lg font-bold text-yefa-navy">Coming Up</h2>
          <p className="mt-1 text-sm text-yefa-ink">Click an item to jump to it on the calendar above.</p>
          <div className="mt-4 space-y-3">
            {upcoming.map((e) => (
              <button
                key={e.id}
                type="button"
                onClick={() => jumpToEvent(e)}
                className="flex w-full flex-col gap-2 rounded-2xl border border-slate-200 bg-white p-5 text-left transition hover:-translate-y-0.5 hover:border-yefa-blue/30 hover:shadow-[0_18px_30px_-18px_rgba(16,20,43,0.25)] sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-3">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${TYPE_STYLES[e.type]}`}>
                    {TYPE_LABEL[e.type]}
                  </span>
                  <div>
                    <h4 className="font-semibold text-yefa-navy">{e.title}</h4>
                    <p className="text-sm text-yefa-ink">{formatDateLabel(e.date)}</p>
                  </div>
                </div>
                <span className="text-sm font-semibold text-yefa-ink">{formatTime12h(e.time)}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {!loading && events.length === 0 && !error && (
        <p className="mt-12 text-sm text-yefa-ink">
          No meetings or competitions have been posted yet — check back soon.
        </p>
      )}
    </>
  )
}
