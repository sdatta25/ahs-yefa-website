import { useEffect, useState } from "react"
import type { FormEvent } from "react"
import { fetchSettings, saveSettings, type OfficerSettings } from "../../lib/api"

// Turns a normal Google Sheets link into one that can be embedded read-only.
function toEmbedUrl(url: string): string | null {
  const published = url.match(/docs\.google\.com\/spreadsheets\/d\/e\/([^/]+)/)
  if (published) return `https://docs.google.com/spreadsheets/d/e/${published[1]}/pubhtml?widget=true&headers=false`
  const sheet = url.match(/docs\.google\.com\/spreadsheets\/d\/([^/]+)/)
  if (!sheet) return null
  const gid = url.match(/[#?&]gid=(\d+)/)
  return `https://docs.google.com/spreadsheets/d/${sheet[1]}/preview${gid ? `?gid=${gid[1]}` : ""}`
}

export default function SheetPreview({
  field,
  title,
  description,
}: {
  field: keyof OfficerSettings
  title: string
  description: string
}) {
  const [url, setUrl] = useState("")
  const [draft, setDraft] = useState("")
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchSettings()
      .then((s) => {
        const saved = s?.[field] ?? ""
        setUrl(saved)
        setDraft(saved)
        setEditing(!saved)
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Couldn't load the sheet link."))
      .finally(() => setLoading(false))
  }, [field])

  async function handleSave(e: FormEvent) {
    e.preventDefault()
    setError(null)
    const trimmed = draft.trim()
    if (trimmed && !toEmbedUrl(trimmed)) {
      setError("Paste a Google Sheets link (docs.google.com/spreadsheets/…).")
      return
    }
    setSaving(true)
    try {
      const next = await saveSettings({ [field]: trimmed })
      const saved = next?.[field] ?? ""
      setUrl(saved)
      setEditing(!saved)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't save.")
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <p className="text-sm text-yefa-ink">Loading&hellip;</p>

  const embed = url ? toEmbedUrl(url) : null

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-yefa-navy">{title}</h2>
          <p className="mt-1 max-w-xl text-sm text-yefa-ink">{description}</p>
        </div>
        {url && !editing && (
          <div className="flex shrink-0 gap-2">
            <a
              href={url}
              target="_blank"
              rel="noreferrer"
              className="rounded-lg bg-yefa-blue px-4 py-2 text-sm font-semibold text-white transition hover:bg-yefa-blue-dark"
            >
              Open in Google Sheets
            </a>
            <button
              onClick={() => setEditing(true)}
              className="rounded-lg px-4 py-2 text-sm font-semibold text-yefa-ink ring-1 ring-inset ring-slate-300 transition hover:bg-slate-50"
            >
              Change link
            </button>
          </div>
        )}
      </div>

      {editing && (
        <form onSubmit={handleSave} className="rounded-2xl border border-slate-200 bg-white p-5">
          <label className="block text-sm font-medium text-yefa-ink">
            Google Sheets link
            <input
              type="url"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="https://docs.google.com/spreadsheets/d/…"
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-yefa-blue focus:outline-none focus:ring-1 focus:ring-yefa-blue"
            />
          </label>
          <p className="mt-2 text-xs text-slate-500">
            Tip: for a Google Form, open its Responses tab and click "Link to Sheets", then paste that sheet's link here.
            Officers need view access to the sheet for the preview to load.
          </p>
          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
          <div className="mt-4 flex gap-2">
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-yefa-blue px-4 py-2 text-sm font-semibold text-white transition hover:bg-yefa-blue-dark disabled:opacity-60"
            >
              {saving ? "Saving…" : "Save link"}
            </button>
            {url && (
              <button
                type="button"
                onClick={() => {
                  setDraft(url)
                  setEditing(false)
                  setError(null)
                }}
                className="rounded-lg px-4 py-2 text-sm font-semibold text-yefa-ink hover:text-yefa-blue"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      )}

      {!editing && error && <p className="text-sm text-red-600">{error}</p>}

      {embed && !editing && (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <iframe src={embed} title={title} className="h-[70vh] w-full" loading="lazy" />
        </div>
      )}
    </div>
  )
}
