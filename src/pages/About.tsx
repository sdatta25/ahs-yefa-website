import PageHeader from "../components/PageHeader"
import { SITE } from "../data/site"

export default function About() {
  return (
    <div>
      <PageHeader title="About YEFA" subtitle="Our mission, what we do, and why we exist." />

      <section className="mx-auto max-w-4xl px-5 py-16">
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-7">
            <h2 className="text-lg font-bold text-yefa-navy">Our Mission</h2>
            <p className="mt-2 text-yefa-ink">{SITE.tagline}</p>
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
