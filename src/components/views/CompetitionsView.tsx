import { Link } from "react-router-dom"
import { COMPETITIONS } from "../../data/competitions"

export default function CompetitionsView() {
  return (
    <>
      <p className="mb-8 max-w-2xl leading-relaxed text-yefa-ink">
        These are the {COMPETITIONS.length} competitions on YEFA's radar this year. Once a date or deadline is
        confirmed, it goes on the{" "}
        <Link to="/calendar" className="font-semibold text-yefa-blue hover:underline">
          Calendar
        </Link>
        .
      </p>

      <ul className="grid gap-x-12 border-t border-yefa-rule sm:grid-cols-2">
        {COMPETITIONS.map((name) => (
          <li key={name} className="border-b border-yefa-rule py-3.5 text-yefa-navy">
            {name}
          </li>
        ))}
      </ul>
    </>
  )
}
