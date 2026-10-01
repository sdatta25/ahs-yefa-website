import type { Officer } from "../data/officers"

export default function OfficerCard({ officer }: { officer: Officer }) {
  return (
    <div className="group rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-yefa-blue-light to-yefa-blue text-3xl font-bold text-white">
        {officer.photo ? (
          <img src={officer.photo} alt={officer.name} className="h-full w-full rounded-full object-cover" />
        ) : (
          <span>
            {officer.name
              .split(" ")
              .map((w) => w[0])
              .join("")
              .slice(0, 2) || "?"}
          </span>
        )}
      </div>
      <h3 className="mt-4 text-base font-semibold text-yefa-navy">{officer.name}</h3>
      <p className="text-sm font-medium text-yefa-orange">{officer.position}</p>
      {officer.bio && <p className="mt-2 text-sm text-slate-500">{officer.bio}</p>}
    </div>
  )
}
