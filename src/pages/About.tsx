import PageHeader from "../components/PageHeader"

export default function About() {
  return (
    <div>
      <PageHeader title="About YEFA" subtitle="Who we are, what we do, and how to get involved." />

      <section className="mx-auto max-w-4xl px-5 py-16">
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-7">
            <h2 className="text-lg font-bold text-yefa-navy">What YEFA is</h2>
            <p className="mt-2 text-yefa-ink">
              AHS YEFA is a student-run club at Alpharetta High School for anyone interested in
              economics, finance, and investing — no prior experience required. It's entirely
              organized by students: the officer team plans meetings, tracks competition
              deadlines, and runs the club day to day.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-7">
            <h2 className="text-lg font-bold text-yefa-navy">What we do</h2>
            <p className="mt-2 text-yefa-ink">
              Members prep for and compete in national economics, finance, and entrepreneurship
              competitions — see the full list on the{" "}
              <a href="/competitions" className="font-semibold text-yefa-blue hover:underline">
                Competitions page
              </a>
              . Meeting times and confirmed competition deadlines are posted on the{" "}
              <a href="/calendar" className="font-semibold text-yefa-blue hover:underline">
                Calendar
              </a>{" "}
              as they're set, and study guides or prep material go up on{" "}
              <a href="/resources" className="font-semibold text-yefa-blue hover:underline">
                Resources
              </a>{" "}
              once they're ready.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-7">
            <h2 className="text-lg font-bold text-yefa-navy">How to get involved</h2>
            <p className="mt-2 text-yefa-ink">
              New members are welcome all year — there's no application deadline to miss. Head
              to the{" "}
              <a href="/contact" className="font-semibold text-yefa-blue hover:underline">
                Join page
              </a>{" "}
              to fill out the sign-up form, or message an officer directly if you'd rather ask
              questions first.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
