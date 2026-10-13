import { Link } from "react-router-dom"
import { COMPETITIONS } from "../../data/competitions"

export default function CompetitionsView() {
  return (
    <>
      <div className="mb-8 flex items-start gap-3 rounded-2xl border border-yefa-blue/25 bg-yefa-blue-50 px-5 py-4 text-sm">
        <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-yefa-blue" />
        <p className="text-yefa-ink">
          This is the full list of competitions on YEFA's radar this year. Once a date or deadline
          is confirmed, it'll be added to the{" "}
          <Link to="/calendar" className="font-semibold text-yefa-blue hover:underline">
            Calendar
          </Link>
          .
        </p>
      </div>

      <ol className="grid gap-3 sm:grid-cols-2">
        {COMPETITIONS.map((name, i) => (
          <li key={name} className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-yefa-blue-50 text-xs font-bold text-yefa-blue">
              {i + 1}
            </span>
            <span className="text-sm font-medium text-yefa-navy">{name}</span>
          </li>
        ))}
      </ol>
    </>
  )
}
