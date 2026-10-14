import { requireAuth, parseBody } from "./_lib/http.js"
import { readCollection, writeCollection } from "./_lib/store.js"

// Officer-only settings (e.g. the Google Sheet links previewed in the officer
// portal). Stored as a one-element collection so it reuses the blob store.
const PREFIX = "data/settings-"
const FIELDS = ["pointsSheetUrl", "membersSheetUrl"]

function sanitize(input) {
  const out = {}
  for (const key of FIELDS) {
    const value = input && input[key]
    out[key] = typeof value === "string" ? value.trim() : ""
  }
  return out
}

async function readSettings() {
  const [settings] = await readCollection(PREFIX)
  return sanitize(settings || {})
}

export default async function handler(req, res) {
  if (!requireAuth(req, res)) return

  if (req.method === "GET") {
    return res.status(200).json({ settings: await readSettings() })
  }

  if (req.method === "PUT") {
    const body = parseBody(req)
    const current = await readSettings()
    const next = sanitize({ ...current, ...(body.settings || {}) })
    await writeCollection(PREFIX, [next])
    return res.status(200).json({ settings: next })
  }

  res.setHeader("Allow", "GET, PUT")
  return res.status(405).json({ error: "Method not allowed" })
}
