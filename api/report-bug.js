import crypto from "crypto"
import { requireAuth, parseBody } from "./_lib/http.js"
import { readCollection, writeCollection } from "./_lib/store.js"

const PREFIX = "data/bugs-"
const SETTINGS = "data/settings-"
const KEEP = 300

function clip(value, max) {
  return typeof value === "string" ? value.trim().slice(0, max) : ""
}

// Where the reporter's browser forwards the email (FormSubmit only accepts
// requests from browsers). It's the address set in Admin or BUG_REPORT_EMAIL,
// or better, the private alias FormSubmit gives after activation. Not stored
// in this public repo.
async function relayTarget() {
  const [settings] = await readCollection(SETTINGS)
  return process.env.BUG_REPORT_EMAIL || settings?.bugReportEmail || ""
}

export default async function handler(req, res) {
  // Officers read the saved reports in Admin.
  if (req.method === "GET") {
    if (!requireAuth(req, res)) return
    const bugs = await readCollection(PREFIX)
    return res.status(200).json({ bugs })
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", "GET, POST")
    return res.status(405).json({ error: "Method not allowed" })
  }

  const body = parseBody(req)
  if (body.website) return res.status(200).json({ ok: true }) // hidden field: bots fill it in
  const message = clip(body.message, 3000)
  if (message.length < 5) return res.status(400).json({ error: "Tell us a bit about what went wrong." })

  const report = {
    id: crypto.randomUUID(),
    message,
    email: clip(body.email, 200),
    name: clip(body.name, 120),
    page: clip(body.page, 500),
    device: clip(body.device, 400),
    createdAt: new Date().toISOString(),
  }

  const bugs = await readCollection(PREFIX)
  bugs.unshift(report)
  await writeCollection(PREFIX, bugs.slice(0, KEEP), { secret: true })

  return res.status(201).json({ ok: true, relay: await relayTarget() })
}
