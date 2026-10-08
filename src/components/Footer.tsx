import BrandLogo from "./BrandLogo"
import { SITE } from "../data/site"

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-white/10 bg-yefa-navy text-slate-300">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:grid-cols-3">
        <div>
          <BrandLogo size="sm" />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-400">{SITE.tagline}</p>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-widest text-yefa-orange-light">Explore</h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li><a className="text-slate-300 transition hover:text-white" href="/about">About the Club</a></li>
            <li><a className="text-slate-300 transition hover:text-white" href="/officers">Officers</a></li>
            <li><a className="text-slate-300 transition hover:text-white" href="/meetings-competitions">Meetings &amp; Competitions</a></li>
            <li><a className="text-slate-300 transition hover:text-white" href="/forms">Forms</a></li>
            <li><a className="text-slate-300 transition hover:text-white" href="/resources">Resources</a></li>
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-widest text-yefa-orange-light">Get in Touch</h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li><a className="text-slate-300 transition hover:text-white" href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a></li>
            <li><a className="text-slate-300 transition hover:text-white" href={SITE.instagram} target="_blank" rel="noreferrer">Instagram</a></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 py-5 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} {SITE.shortName}. All rights reserved.
      </div>
    </footer>
  )
}
