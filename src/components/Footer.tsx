import { Link } from "react-router-dom"
import { SITE } from "../data/site"

const COLUMNS = [
  {
    heading: "The club",
    links: [
      { label: "About", to: "/about" },
      { label: "Officers", to: "/officers" },
      { label: "Partners", to: "/partners" },
      { label: "Join", to: "/contact" },
    ],
  },
  {
    heading: "For members",
    links: [
      { label: "Calendar", to: "/calendar" },
      { label: "Competitions", to: "/competitions" },
      { label: "Forms", to: "/forms" },
      { label: "Resources", to: "/resources" },
    ],
  },
]

export default function Footer() {
  return (
    <footer className="bg-yefa-navy text-slate-300">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr]">
        <div>
          <p className="font-display text-2xl font-extrabold text-white [font-stretch:125%]">AHS YEFA X YEI</p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-slate-400">
            Youth Entrepreneurship &amp; Finance Association at Alpharetta High School.
          </p>
        </div>

        {COLUMNS.map((col) => (
          <div key={col.heading}>
            <h3 className="text-sm font-semibold text-white">{col.heading}</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {col.links.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="transition-colors hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div>
          <h3 className="text-sm font-semibold text-white">Contact</h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li>
              <a className="break-all transition-colors hover:text-white" href={`mailto:${SITE.contactEmail}`}>
                {SITE.contactEmail}
              </a>
            </li>
            <li>
              <a className="transition-colors hover:text-white" href={SITE.instagram} target="_blank" rel="noreferrer">
                Instagram
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 px-5 py-5 text-xs text-slate-500">
          <span>
            © {new Date().getFullYear()} {SITE.shortName}
          </span>
          <Link to="/officer" className="transition-colors hover:text-slate-300">
            Officer login
          </Link>
        </div>
      </div>
    </footer>
  )
}
