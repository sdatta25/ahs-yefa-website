import PageHeader from "../components/PageHeader"
import { SITE } from "../data/site"

export default function Contact() {
  return (
    <div>
      <PageHeader title="Join YEFA" subtitle="New members are welcome all year round." />

      <section className="mx-auto max-w-3xl px-5 py-16">
        <p className="text-center text-yefa-ink">
          Interested in joining? Fill out the member sign-up form below, or reach out directly
          and an officer will follow up with next steps and meeting times.
        </p>

        <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <iframe
            src={SITE.memberSignupFormEmbed}
            title="YEFA Member Sign-Up Form"
            className="h-[1200px] w-full"
            loading="lazy"
          >
            Loading form&hellip;
          </iframe>
        </div>

        <div className="mt-10 flex flex-col items-center gap-3">
          <a
            href={`mailto:${SITE.contactEmail}?subject=Interested in joining YEFA`}
            className="w-full max-w-sm rounded-full px-7 py-3 text-center text-sm font-semibold text-yefa-navy ring-1 ring-inset ring-slate-300 transition hover:bg-slate-50"
          >
            Email {SITE.contactEmail}
          </a>
          <a
            href={SITE.instagram}
            target="_blank"
            rel="noreferrer"
            className="w-full max-w-sm rounded-full px-7 py-3 text-center text-sm font-semibold text-yefa-navy ring-1 ring-inset ring-slate-300 transition hover:bg-slate-50"
          >
            Follow us on Instagram
          </a>
        </div>
      </section>
    </div>
  )
}
