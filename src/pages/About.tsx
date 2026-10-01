import PageHeader from "../components/PageHeader"

export default function About() {
  return (
    <div>
      <PageHeader
        title="About YEFA"
        subtitle="Our mission, what we do, and why we exist."
      />

      <section className="mx-auto max-w-4xl space-y-10 px-5 py-14">
        <div>
          <h2 className="text-xl font-bold text-yefa-navy">Our Mission</h2>
          <p className="mt-2 text-slate-600">
            [Placeholder] YEFA exists to give students real exposure to economics, personal
            finance, and investing through friendly competitions, guest speakers, and
            member-led workshops. Replace this paragraph with the club's official mission
            statement.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-bold text-yefa-navy">What We Do</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-600">
            <li>Weekly or bi-weekly meetings covering finance & economics topics (TBA)</li>
            <li>Prep for national competitions like the Fed Challenge, stock market games, and case competitions</li>
            <li>Guest speaker sessions with industry professionals and alumni</li>
            <li>Workshops on investing, budgeting, and career paths in finance</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-bold text-yefa-navy">How to Get Involved</h2>
          <p className="mt-2 text-slate-600">
            New members are welcome all year. Head to the{" "}
            <a href="/contact" className="font-semibold text-yefa-blue hover:underline">
              Join page
            </a>{" "}
            to sign up or reach out to an officer.
          </p>
        </div>
      </section>
    </div>
  )
}
