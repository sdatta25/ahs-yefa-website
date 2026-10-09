import PageHeader from "../components/PageHeader"
import { SITE } from "../data/site"

export default function Contact() {
  return (
    <div>
      <PageHeader title="Join YEFA" subtitle="New members are welcome all year round." />

      <section className="mx-auto max-w-2xl px-5 py-16 text-center">
        <p className="text-yefa-ink">
          Interested in joining? Fill out the member sign-up form below, or reach out directly
          and an officer will follow up with next steps and meeting times.
        </p>

        <div className="mt-8 flex flex-col items-center gap-3">
          <a
            href={SITE.memberSignupForm}
            target="_blank"
            rel="noreferrer"
            className="w-full max-w-sm rounded-full bg-yefa-blue px-7 py-3 text-sm font-semibold text-white shadow-[0_8px_20px_-6px_rgba(54,87,201,0.55)] transition hover:bg-yefa-blue-dark"
          >
            Member Sign-Up Form
          </a>
          <a
            href={`mailto:${SITE.contactEmail}?subject=Interested in joining YEFA`}
            className="w-full max-w-sm rounded-full px-7 py-3 text-sm font-semibold text-yefa-navy ring-1 ring-inset ring-slate-300 transition hover:bg-slate-50"
          >
            Email {SITE.contactEmail}
          </a>
          <a
            href={SITE.instagram}
            target="_blank"
            rel="noreferrer"
            className="w-full max-w-sm rounded-full px-7 py-3 text-sm font-semibold text-yefa-navy ring-1 ring-inset ring-slate-300 transition hover:bg-slate-50"
          >
            Follow us on Instagram
          </a>
        </div>
      </section>
    </div>
  )
}
