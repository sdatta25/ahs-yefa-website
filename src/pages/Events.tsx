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
      <PageHeader title="Events & Meetings" subtitle="Upcoming meetings, guest speakers, and workshops." />

      <section className="mx-auto max-w-5xl px-5 py-16">
        <h2 className="text-lg font-bold text-yefa-navy">Upcoming Meetings</h2>
        <div className="mt-4 space-y-3">
          {MEETINGS.map((m, i) => (
            <div key={i} className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-yefa-blue-50 text-xs font-bold uppercase tracking-wide text-yefa-blue">
                {m.date}
              </div>
              <div>
                <h3 className="font-semibold text-yefa-navy">{m.title}</h3>
                <p className="text-sm text-yefa-ink">{m.location}</p>
              </div>
            </div>
          ))}
        </div>

        <h2 className="mt-14 text-lg font-bold text-yefa-navy">Opportunities</h2>
        <div className="mt-4 grid gap-5 sm:grid-cols-3">
          {OPPORTUNITIES.map((o) => (
            <div key={o.title} className="rounded-2xl border border-slate-200 bg-white p-5">
              <h3 className="font-semibold text-yefa-navy">{o.title}</h3>
              <p className="mt-2 text-sm text-yefa-ink">{o.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
