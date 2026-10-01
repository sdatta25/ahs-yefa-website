import PageHeader from "../components/PageHeader"
import { SITE } from "../data/site"

export default function Contact() {
  return (
    <div>
      <PageHeader title="Join YEFA" subtitle="New members are welcome all year round." />

      <section className="mx-auto max-w-2xl px-5 py-14 text-center">
        <p className="text-slate-600">
          Interested in joining? Reach out and an officer will follow up with next steps,
          meeting times, and how to get involved.
        </p>

        <div className="mt-8 flex flex-col items-center gap-4">
          <a
            href={`mailto:${SITE.contactEmail}?subject=Interested in joining YEFA`}
            className="w-full max-w-sm rounded-full bg-yefa-blue px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-yefa-blue/30 transition hover:bg-yefa-blue-dark"
          >
            Email {SITE.contactEmail}
          </a>
          <a
            href={SITE.instagram}
            target="_blank"
            rel="noreferrer"
            className="w-full max-w-sm rounded-full border-2 border-yefa-orange px-7 py-3 text-sm font-semibold text-yefa-orange transition hover:bg-yefa-orange hover:text-white"
          >
            Follow us on Instagram
          </a>
        </div>

        <p className="mt-10 text-xs text-slate-400">
          Placeholder contact info — update with the real club email and socials in{" "}
          <code className="rounded bg-slate-100 px-1.5 py-0.5">src/data/site.ts</code>.
        </p>
      </section>
    </div>
  )
}
