import type { Officer } from "../data/officers"

export default function OfficerCard({ officer }: { officer: Officer }) {
  const initials =
    officer.name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .slice(0, 2) || "?"

  return (
    <div className="rounded-md border border-yefa-rule bg-white p-5 text-center">
      <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-yefa-blue-50 text-xl font-bold text-yefa-blue ring-1 ring-yefa-blue/15">
        {officer.photo ? (
          <img src={officer.photo} alt={officer.name} className="h-full w-full rounded-full object-cover" />
        ) : (
          <span>{initials}</span>
        )}
      </div>
      <h3 className="mt-4 text-base font-semibold text-yefa-navy">{officer.name}</h3>
      <p className="text-sm font-medium text-yefa-orange-ink">{officer.position}</p>
      {officer.bio && <p className="mt-2 text-sm text-yefa-ink">{officer.bio}</p>}
    </div>
  )
}
