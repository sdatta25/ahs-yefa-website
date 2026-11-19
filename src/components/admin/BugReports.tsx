import { useEffect, useState } from "react"
import type { FormEvent } from "react"
import { fetchBugReports, fetchSettings, saveSettings, type BugReport } from "../../lib/api"

const field =
  "w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-yefa-blue focus:outline-none focus:ring-1 focus:ring-yefa-blue"

function when(iso: string) {
  return new Date(iso).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit", timeZone: "America/New_York" }) + " ET"
}

export default function BugReports() {
  const [bugs, setBugs] = useState<BugReport[] | null>(null)
  const [email, setEmail] = useState("")
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchBugReports().then(setBugs).catch((e) => { setBugs([]); setError(e instanceof Error ? e.message : "Couldn't load reports.") })
    fetchSettings().then((s) => setEmail(s?.bugReportEmail ?? "")).catch(() => {})
  }, [])

  async function save(e: FormEvent) {
    e.preventDefault()
    setSaved(false)
    setError(null)
    try {
      await saveSettings({ bugReportEmail: email.trim() })
      setSaved(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't save.")
    }
  }

  return (
    <div className="space-y-8">
      <form onSubmit={save} className="rounded-md border border-yefa-rule bg-white p-5">
        <label htmlFor="bug-to" className="block text-sm font-medium text-yefa-ink">
          Send new reports to
        </label>
        <div className="mt-1 flex flex-wrap gap-2">
          <input id="bug-to" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className={`${field} min-w-0 flex-1`} />
          <button className="rounded-md bg-yefa-blue px-4 py-2 text-sm font-semibold text-white hover:bg-yefa-blue-dark">Save</button>
        </div>
        <p className="mt-2 text-xs text-slate-500">
          The first report sends an activation email from FormSubmit to this address. Click <b>Activate</b> in it and
          reports arrive from then on. FormSubmit's email also gives a random alias: paste that here instead of
          your address to keep it private. Every report is also saved below.
        </p>
        {saved && <p className="mt-2 text-sm text-green-700">Saved.</p>}
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </form>

      {bugs === null ? (
        <p className="text-sm text-yefa-ink">Loading reports…</p>
      ) : bugs.length === 0 ? (
        <p className="text-sm text-yefa-ink">No bug reports yet.</p>
      ) : (
        <ul className="space-y-3">
          {bugs.map((b) => (
            <li key={b.id} className="rounded-md border border-yefa-rule bg-white p-4">
              <div className="flex flex-wrap justify-between gap-2 text-xs text-slate-500">
                <span>{when(b.createdAt)}</span>
                <span>{b.email || b.name || "Anonymous"}</span>
              </div>
              <p className="mt-2 whitespace-pre-wrap text-sm text-yefa-navy [overflow-wrap:anywhere]">{b.message}</p>
              <p className="mt-2 text-xs text-slate-500 [overflow-wrap:anywhere]">
                {b.page}
                {b.emailed && b.emailed !== "sent" ? ` · email ${b.emailed}` : ""}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
