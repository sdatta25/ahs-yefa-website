import crypto from "crypto"
import { requireAuth, parseBody } from "./_lib/http.js"
import { readCollection, writeCollection } from "./_lib/store.js"

const PREFIX = "data/bugs-"
const SETTINGS = "data/settings-"
const KEEP = 300

function clip(value, max) {
  return typeof value === "string" ? value.trim().slice(0, max) : ""
}

// Emails a report through FormSubmit (no account or SMTP needed). The first
// report sends an activation email to the address; reports arrive after it's
// confirmed. The address lives in BUG_REPORT_EMAIL or the Admin setting, not
// in this public repo.
async function emailReport(report) {
  const [settings] = await readCollection(SETTINGS)
  const to = process.env.BUG_REPORT_EMAIL || settings?.bugReportEmail
  if (!to) return "no address set"
  const site = process.env.SITE_URL || "https://ahsyefaandyei.vercel.app"
  const res = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(to)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json", Origin: site, Referer: site + "/" },
    body: JSON.stringify({
      _subject: `YEFA site bug: ${report.message.slice(0, 60)}`,
      _template: "table",
      _captcha: "false",
      ...(report.email ? { _replyto: report.email } : {}),
      Problem: report.message,
      Page: report.page,
      "Reported by": report.email || report.name || "Not given",
      Device: report.device,
      When: report.createdAt,
    }),
  }).catch(() => null)
  return res && res.ok ? "sent" : `failed (${res ? res.status : "network"})`
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

  report.emailed = await emailReport(report)
  const bugs = await readCollection(PREFIX)
  bugs.unshift(report)
  await writeCollection(PREFIX, bugs.slice(0, KEEP), { secret: true })

  return res.status(201).json({ ok: true })
}
