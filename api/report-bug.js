import crypto from "crypto"
import { requireAuth, parseBody } from "./_lib/http.js"
import { readCollection, writeCollection } from "./_lib/store.js"
import { mailer, sendMail } from "./_lib/mail.js"

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
    // ?smtp=1 checks the Gmail login; ?smtp=send also emails a test message.
    if (req.query?.smtp) {
      const m = mailer()
      if (!m) return res.status(200).json({ smtp: "not set" })
      try {
        await m.verify()
        if (req.query.smtp === "send") {
          const to = await relayTarget()
          await sendMail({ to, subject: "YEFA website: email test", text: "Email from the website is working." })
          return res.status(200).json({ smtp: "ok", sentTo: to.replace(/(.).*(@.*)/, "$1…$2") })
        }
        return res.status(200).json({ smtp: "ok" })
      } catch (err) {
        return res.status(200).json({ smtp: "failed", error: String(err.message || err).slice(0, 200) })
      }
    }
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

  // Email it from the club Gmail when that's set up; otherwise the browser
  // forwards it through FormSubmit.
  const to = await relayTarget()
  if (to.includes("@") && mailer()) {
    try {
      await sendMail({
        to,
        replyTo: report.email || undefined,
        subject: `YEFA site bug: ${message.slice(0, 60)}`,
        text: `${message}\n\nPage: ${report.page}\nFrom: ${report.email || report.name || "Not given"}\nDevice: ${report.device}\nWhen: ${report.createdAt}`,
      })
      report.emailed = "sent"
    } catch {
      report.emailed = "failed"
    }
  }
  const bugs = await readCollection(PREFIX)
  bugs.unshift(report)
  await writeCollection(PREFIX, bugs.slice(0, KEEP), { secret: true })

  return res.status(201).json({ ok: true, relay: report.emailed === "sent" ? "" : to })
}
