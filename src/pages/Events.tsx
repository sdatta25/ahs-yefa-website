import PageHeader from "../components/PageHeader"

// PLACEHOLDER DATA — update with real meeting dates / events as they're scheduled.
const MEETINGS = [
  { date: "TBA", title: "First General Meeting", location: "TBA" },
  { date: "TBA", title: "Guest Speaker Session", location: "TBA" },
]

const OPPORTUNITIES = [
  { title: "Guest Speaker Series", desc: "Industry professionals and alumni share career insights." },
  { title: "Workshops", desc: "Hands-on sessions on investing, budgeting, and markets." },
  { title: "External Opportunities", desc: "Internships, scholarships, and programs curated by Outreach." },
]

export default function Events() {
  return (
    <div>
      <PageHeader
        title="Events & Meetings"
        subtitle="Upcoming meetings, guest speakers, and workshops."
      />

      <section className="mx-auto max-w-5xl px-5 py-14">
        <h2 className="text-xl font-bold text-yefa-navy">Upcoming Meetings</h2>
        <div className="mt-4 space-y-4">
          {MEETINGS.map((m, i) => (
            <div key={i} className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-lg bg-yefa-blue text-white">
                <span className="text-xs font-semibold uppercase">{m.date === "TBA" ? "TBA" : m.date}</span>
              </div>
              <div>
                <h3 className="font-semibold text-yefa-navy">{m.title}</h3>
                <p className="text-sm text-slate-500">{m.location}</p>
              </div>
            </div>
          ))}
        </div>

        <h2 className="mt-14 text-xl font-bold text-yefa-navy">Opportunities</h2>
        <div className="mt-4 grid gap-5 sm:grid-cols-3">
          {OPPORTUNITIES.map((o) => (
            <div key={o.title} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="font-semibold text-yefa-navy">{o.title}</h3>
              <p className="mt-2 text-sm text-slate-500">{o.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
