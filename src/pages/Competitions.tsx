import PageHeader from "../components/PageHeader"

type Competition = {
  name: string
  deadline: string
  info: string
}

// PLACEHOLDER DATA — update with real competitions, deadlines, and links.
const COMPETITIONS: Competition[] = [
  { name: "Fed Challenge", deadline: "TBA", info: "Registration & prep resources coming soon." },
  { name: "Stock Market Game", deadline: "TBA", info: "Registration & prep resources coming soon." },
  { name: "Case Competition", deadline: "TBA", info: "Registration & prep resources coming soon." },
]

export default function Competitions() {
  return (
    <div>
      <PageHeader title="Competitions" subtitle="Deadlines, registration info, and prep resources." />

      <section className="mx-auto max-w-5xl px-5 py-16">
        <div className="space-y-4">
          {COMPETITIONS.map((c) => (
            <div
              key={c.name}
              className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-6 sm:flex-row sm:items-center"
            >
              <div>
                <h3 className="text-lg font-semibold text-yefa-navy">{c.name}</h3>
                <p className="mt-1 text-sm text-yefa-ink">{c.info}</p>
              </div>
              <span className="w-fit shrink-0 rounded-full bg-yefa-orange/10 px-4 py-1.5 text-sm font-semibold text-yefa-orange">
                Deadline: {c.deadline}
              </span>
            </div>
          ))}
        </div>

        <p className="mt-10 text-sm text-yefa-ink">
          This section is maintained in coordination with the Head of Competitions. Updates to
          deadlines, registration links, and prep materials go here.
        </p>
      </section>
    </div>
  )
}
