import { useMemo, useState } from "react"
import type { EventItem } from "../lib/api"
import { buildMonthGrid, formatMonthLabel, todayISO } from "../lib/date"

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"]

export default function EventCalendar({
  events,
  selected,
  onSelect,
}: {
  events: EventItem[]
  selected: string
  onSelect: (iso: string) => void
}) {
  const today = todayISO()
  const [cursor, setCursor] = useState(() => {
    const [y, m] = selected.split("-").map(Number)
    return { year: y, month: m - 1 }
  })

  const eventsByDate = useMemo(() => {
    const map = new Map<string, EventItem[]>()
    for (const e of events) {
      if (!map.has(e.date)) map.set(e.date, [])
      map.get(e.date)!.push(e)
    }
    return map
  }, [events])

  const cells = useMemo(() => buildMonthGrid(cursor.year, cursor.month), [cursor])

  function goMonth(delta: number) {
    setCursor((c) => {
      const d = new Date(c.year, c.month + delta, 1)
      return { year: d.getFullYear(), month: d.getMonth() }
    })
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-yefa-navy">{formatMonthLabel(cursor.year, cursor.month)}</h3>
        <div className="flex gap-1">
          <button
            onClick={() => goMonth(-1)}
            aria-label="Previous month"
            className="flex h-8 w-8 items-center justify-center rounded-full text-yefa-ink transition hover:bg-slate-100"
          >
            &larr;
          </button>
          <button
            onClick={() => goMonth(1)}
            aria-label="Next month"
            className="flex h-8 w-8 items-center justify-center rounded-full text-yefa-ink transition hover:bg-slate-100"
          >
            &rarr;
          </button>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-7 gap-1 text-center text-xs font-semibold text-slate-400">
        {WEEKDAYS.map((w, i) => (
          <div key={i} className="py-1">{w}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {cells.map((cell) => {
          const dayEvents = eventsByDate.get(cell.iso) ?? []
          const isSelected = cell.iso === selected
          const isToday = cell.iso === today
          return (
            <button
              key={cell.iso}
              onClick={() => onSelect(cell.iso)}
              className={`relative flex aspect-square flex-col items-center justify-center rounded-xl text-sm transition ${
                isSelected
                  ? "bg-yefa-blue text-white font-semibold"
                  : cell.inMonth
                    ? "text-yefa-navy hover:bg-yefa-blue-50"
                    : "text-slate-300 hover:bg-slate-50"
              } ${isToday && !isSelected ? "ring-1 ring-inset ring-yefa-orange" : ""}`}
            >
              {cell.day}
              {dayEvents.length > 0 && (
                <span
                  className={`absolute bottom-1.5 h-1 w-1 rounded-full ${
                    isSelected ? "bg-white" : "bg-yefa-orange"
                  }`}
                />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
