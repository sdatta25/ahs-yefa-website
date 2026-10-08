import { useEffect, useMemo, useState } from "react"
import PageHeader from "../components/PageHeader"
import EventCalendar from "../components/EventCalendar"
import { fetchEvents, type EventItem } from "../lib/api"
import { formatDateLabel, formatTime12h, todayISO } from "../lib/date"

const TYPE_STYLES: Record<EventItem["type"], string> = {
  meeting: "bg-yefa-blue/10 text-yefa-blue",
  competition: "bg-yefa-orange/10 text-yefa-orange",
}

const TYPE_LABEL: Record<EventItem["type"], string> = {
  meeting: "Meeting",
  competition: "Competition",
}

export default function MeetingsCompetitions() {
  const [events, setEvents] = useState<EventItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selected, setSelected] = useState(todayISO())

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

  return (
    <div>
      <PageHeader
        title="Meetings & Competitions"
        subtitle="Calendar of upcoming meetings and competition deadlines. All times Eastern."
      />

      <section className="mx-auto max-w-5xl px-5 py-16">
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {loading ? (
          <p className="text-sm text-yefa-ink">Loading calendar&hellip;</p>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
            <EventCalendar events={events} selected={selected} onSelect={setSelected} />

            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <h3 className="text-base font-semibold text-yefa-navy">{formatDateLabel(selected)}</h3>

              {selectedEvents.length === 0 ? (
                <p className="mt-4 text-sm text-yefa-ink">None.</p>
              ) : (
                <ul className="mt-4 space-y-3">
                  {selectedEvents.map((e) => (
                    <li key={e.id} className="rounded-xl border border-slate-200 p-4">
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
            <div className="mt-4 space-y-3">
              {upcoming.map((e) => (
                <div
                  key={e.id}
                  className="flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white p-5 sm:flex-row sm:items-center sm:justify-between"
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
                </div>
              ))}
            </div>
          </div>
        )}

        {!loading && events.length === 0 && !error && (
          <p className="mt-12 text-sm text-yefa-ink">
            No meetings or competitions have been posted yet — check back soon.
          </p>
        )}
      </section>
    </div>
  )
}
