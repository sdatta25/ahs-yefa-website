import { SITE } from "../data/site"

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-slate-200 bg-yefa-navy text-slate-200">
      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-12 sm:grid-cols-3">
        <div>
          <img src="/images/yefa-logo.svg" alt="YEFA logo" className="h-8 w-auto brightness-0 invert" />
          <p className="mt-3 max-w-xs text-sm text-slate-400">{SITE.tagline}</p>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-yefa-orange-light">Explore</h3>
          <ul className="mt-3 space-y-2 text-sm text-slate-300">
            <li><a className="hover:text-white" href="/about">About the Club</a></li>
            <li><a className="hover:text-white" href="/officers">Officers</a></li>
            <li><a className="hover:text-white" href="/competitions">Competitions</a></li>
            <li><a className="hover:text-white" href="/events">Events &amp; Meetings</a></li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-yefa-orange-light">Get in Touch</h3>
          <ul className="mt-3 space-y-2 text-sm text-slate-300">
            <li>{SITE.contactEmail}</li>
            <li><a className="hover:text-white" href={SITE.instagram} target="_blank" rel="noreferrer">Instagram</a></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 py-4 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} {SITE.shortName}. All rights reserved.
      </div>
    </footer>
  )
}
