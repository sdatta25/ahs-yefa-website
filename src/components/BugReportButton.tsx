import { useEffect, useRef, useState } from "react"
import type { FormEvent } from "react"
import { useLocation } from "react-router-dom"
import { useSession, displayName } from "../lib/useSession"

// A bug button fixed to the bottom-left of every page. Reports go to the
// webmaster by email and are saved for Admin.
export default function BugReportButton() {
  const { pathname, search } = useLocation()
  const { session } = useSession()
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState("")
  const [email, setEmail] = useState("")
  const [trap, setTrap] = useState("")
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle")
  const [error, setError] = useState<string | null>(null)
  const dialog = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const d = dialog.current
    if (!d) return
    if (open && !d.open) d.showModal()
    if (!open && d.open) d.close()
  }, [open])

  function openForm() {
    setEmail((e) => e || session?.user.email || "")
    setState("idle")
    setError(null)
    setOpen(true)
  }

  async function submit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    if (message.trim().length < 5) return setError("Tell us a bit about what went wrong.")
    setState("sending")
    try {
      const res = await fetch("/api/report-bug", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          email,
          name: displayName(session?.user),
          page: window.location.origin + pathname + search,
          device: `${navigator.userAgent} | ${window.innerWidth}x${window.innerHeight}`,
          website: trap,
        }),
      })
      const body = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(body.error || "Couldn't send the report.")
      setState("sent")
      setMessage("")
    } catch (err) {
      setState("idle")
      setError(err instanceof Error ? err.message : "Couldn't send the report.")
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={openForm}
        aria-label="Report a bug"
        title="Report a bug"
        className="fixed bottom-4 left-4 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-yefa-navy text-white shadow-[0_10px_24px_-8px_rgba(15,27,61,0.6)] ring-2 ring-white transition-transform hover:scale-105 active:scale-95 print:hidden"
        style={{ bottom: "max(1rem, env(safe-area-inset-bottom))" }}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6" aria-hidden="true">
          <path d="M8 6.5a4 4 0 0 1 8 0" />
          <rect x="7" y="8" width="10" height="12" rx="5" />
          <path d="M12 12v8M3 13h4M17 13h4M4 8l3 2M20 8l-3 2M4 20l3-2M20 20l-3-2" />
        </svg>
      </button>

      <dialog
        ref={dialog}
        onClose={() => setOpen(false)}
        onClick={(e) => e.target === dialog.current && setOpen(false)}
        className="m-auto w-[min(32rem,calc(100vw-2rem))] rounded-2xl p-0 backdrop:bg-yefa-navy/50 backdrop:backdrop-blur-sm"
      >
        <div className="p-6 sm:p-8">
          {state === "sent" ? (
            <div className="text-center" role="status">
              <h2 className="text-2xl font-bold">Thanks, report sent.</h2>
              <p className="mt-2 text-yefa-ink">The webmaster will take a look.</p>
              <button onClick={() => setOpen(false)} className="btn btn-primary mt-6">
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <h2 className="text-2xl font-bold">Report a bug</h2>
                <button type="button" onClick={() => setOpen(false)} aria-label="Close" className="-m-2 rounded-md p-2 text-2xl leading-none text-yefa-ink hover:bg-yefa-paper">
                  ×
                </button>
              </div>
              <p className="text-yefa-ink">Something broken or confusing? Tell us what happened and what you expected.</p>
              <div>
                <label htmlFor="bug-message" className="auth-label">What went wrong?</label>
                <textarea
                  id="bug-message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={5}
                  maxLength={3000}
                  required
                  className="auth-field h-auto py-3"
                />
              </div>
              <div>
                <label htmlFor="bug-email" className="auth-label">Your email (optional, so we can follow up)</label>
                <input id="bug-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="auth-field" />
              </div>
              <input
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                value={trap}
                onChange={(e) => setTrap(e.target.value)}
                className="absolute -left-[9999px] h-0 w-0 opacity-0"
                name="website"
              />
              <p className="text-xs text-slate-500">The page you're on and your browser type are included to help fix it.</p>
              {error && <p role="alert" className="auth-alert bg-red-50 text-red-700">{error}</p>}
              <button type="submit" disabled={state === "sending"} className="btn btn-primary">
                {state === "sending" && <span className="spinner" aria-hidden="true" />}
                {state === "sending" ? "Sending…" : "Send report"}
              </button>
            </form>
          )}
        </div>
      </dialog>
    </>
  )
}
