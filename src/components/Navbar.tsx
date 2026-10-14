import { useEffect, useRef, useState } from "react"
import { Link, NavLink, useLocation } from "react-router-dom"
import { AnimatePresence, motion } from "framer-motion"
import BrandLogo from "./BrandLogo"
import { NAV_MORE, NAV_PRIMARY } from "../data/site"
import { firstName, useSession } from "../lib/useSession"

function linkClass(isActive: boolean) {
  return `whitespace-nowrap rounded-full px-3 py-2 text-sm font-medium transition-colors ${
    isActive ? "text-yefa-blue" : "text-yefa-ink hover:text-yefa-blue"
  }`
}

function MoreMenu() {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const { pathname } = useLocation()
  const active = NAV_MORE.some((l) => pathname.startsWith(l.to))

  useEffect(() => {
    if (!open) return
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false)
    }
    document.addEventListener("mousedown", onClick)
    document.addEventListener("keydown", onKey)
    return () => {
      document.removeEventListener("mousedown", onClick)
      document.removeEventListener("keydown", onKey)
    }
  }, [open])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="menu"
        className={`${linkClass(active)} inline-flex items-center gap-1`}
      >
        More
        <svg viewBox="0 0 20 20" fill="currentColor" className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}>
          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.06l3.71-3.83a.75.75 0 111.08 1.04l-4.25 4.39a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z" clipRule="evenodd" />
        </svg>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-48 rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg"
          >
            {NAV_MORE.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                role="menuitem"
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `block rounded-lg px-3 py-2 text-sm font-medium ${
                    isActive ? "bg-yefa-blue/10 text-yefa-blue" : "text-yefa-ink hover:bg-slate-50"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { session } = useSession()
  const name = firstName(session?.user)
  const account = session
    ? { label: name ? `Hi, ${name}` : "My Portal", to: "/member" }
    : { label: "Sign In", to: "/login" }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-5 py-3">
        <NavLink to="/" onClick={() => setOpen(false)} className="shrink-0">
          <BrandLogo size="sm" />
        </NavLink>

        <nav className="hidden items-center lg:flex">
          {NAV_PRIMARY.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.to === "/"} className={({ isActive }) => linkClass(isActive)}>
              {link.label}
            </NavLink>
          ))}
          <MoreMenu />
          <span className="mx-2 h-5 w-px bg-slate-200" />
          <NavLink to={account.to} className={({ isActive }) => linkClass(isActive)}>
            {account.label}
          </NavLink>
          <Link
            to="/contact"
            className="ml-1 shrink-0 whitespace-nowrap rounded-lg bg-yefa-blue px-4 py-2 text-sm font-semibold text-white transition hover:bg-yefa-blue-dark"
          >
            Join
          </Link>
        </nav>

        <button
          onClick={() => setOpen((v) => !v)}
          className="flex h-9 w-9 shrink-0 flex-col items-center justify-center gap-1.5 lg:hidden"
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          <span className={`h-0.5 w-5 bg-yefa-navy transition-transform ${open ? "translate-y-2 rotate-45" : ""}`} />
          <span className={`h-0.5 w-5 bg-yefa-navy transition-opacity ${open ? "opacity-0" : ""}`} />
          <span className={`h-0.5 w-5 bg-yefa-navy transition-transform ${open ? "-translate-y-2 -rotate-45" : ""}`} />
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-slate-200/80 bg-white lg:hidden"
          >
            <div className="flex max-h-[70vh] flex-col gap-1 overflow-y-auto px-5 py-3">
              {[...NAV_PRIMARY, ...NAV_MORE, account].map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === "/"}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `rounded-lg px-3 py-2.5 text-sm font-medium ${
                      isActive ? "bg-yefa-blue/10 text-yefa-blue" : "text-yefa-ink hover:bg-slate-50"
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
              <Link
                to="/contact"
                onClick={() => setOpen(false)}
                className="mt-1 rounded-lg bg-yefa-blue px-3 py-2.5 text-center text-sm font-semibold text-white"
              >
                Join
              </Link>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}
