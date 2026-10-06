import PageHeader from "../components/PageHeader"

const SECTIONS = [
  {
    title: "Our Mission",
    body: "[Placeholder] YEFA exists to give students real exposure to economics, personal finance, and investing through friendly competitions, guest speakers, and member-led workshops. Replace this paragraph with the club's official mission statement.",
  },
]

const WHAT_WE_DO = [
  "Weekly or bi-weekly meetings covering finance & economics topics (TBA)",
  "Prep for national competitions like the Fed Challenge, stock market games, and case competitions",
  "Guest speaker sessions with industry professionals and alumni",
  "Workshops on investing, budgeting, and career paths in finance",
]

export default function About() {
  return (
    <div>
      <PageHeader title="About YEFA" subtitle="Our mission, what we do, and why we exist." />

      <section className="mx-auto max-w-4xl px-5 py-16">
        <div className="space-y-6">
          {SECTIONS.map((s) => (
            <div key={s.title} className="rounded-2xl border border-slate-200 bg-white p-7">
              <h2 className="text-lg font-bold text-yefa-navy">{s.title}</h2>
              <p className="mt-2 text-yefa-ink">{s.body}</p>
            </div>
          ))}

          <div className="rounded-2xl border border-slate-200 bg-white p-7">
            <h2 className="text-lg font-bold text-yefa-navy">What We Do</h2>
            <ul className="mt-4 space-y-3">
              {WHAT_WE_DO.map((item) => (
                <li key={item} className="flex gap-3 text-yefa-ink">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-yefa-orange" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-7">
            <h2 className="text-lg font-bold text-yefa-navy">How to Get Involved</h2>
            <p className="mt-2 text-yefa-ink">
              New members are welcome all year. Head to the{" "}
              <a href="/contact" className="font-semibold text-yefa-blue hover:underline">
                Join page
              </a>{" "}
              to sign up or reach out to an officer.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
