import { readCollection } from "./_lib/store.js"
import { configuredWebPush, readSubs, writeSubs } from "./_lib/push.js"

const DAYS_BEFORE = [3, 2, 1, 0]

// Today's date in Eastern Time (events are stored as Eastern calendar days).
function todayEastern() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "America/New_York" }).format(new Date())
}
function daysBetween(fromIso, toIso) {
  return Math.round((Date.parse(toIso + "T12:00:00Z") - Date.parse(fromIso + "T12:00:00Z")) / 86400000)
}
function time12(hhmm) {
  const [h, m] = String(hhmm || "").split(":").map(Number)
  if (Number.isNaN(h)) return ""
  return `${h % 12 || 12}:${String(m || 0).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`
}

export function reminderFor(event, days) {
  const when = days === 0 ? "Today" : days === 1 ? "Tomorrow" : `In ${days} days`
  const date = new Date(event.date + "T12:00:00Z").toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric", timeZone: "UTC" })
  const details = [days > 1 ? date : null, time12(event.time) && `${time12(event.time)} ET`, event.location].filter(Boolean).join(" · ")
  return {
    title: `${when}: ${event.title}`,
    body: details || (event.type === "competition" ? "Competition" : "YEFA meeting"),
    url: "/member?tab=calendar",
    tag: `yefa-${event.id}-${days}`,
  }
}

// Called once a day by Vercel Cron (vercel.json). Sends a push to every
// subscribed device for events 3, 2 and 1 days away and on the day itself.
export default async function handler(req, res) {
  const cronSecret = process.env.CRON_SECRET
  if (cronSecret && req.headers.authorization !== `Bearer ${cronSecret}`) {
    return res.status(401).json({ error: "Unauthorized" })
  }

  const today = todayEastern()
  const events = (await readCollection("data/events-")).filter((e) => DAYS_BEFORE.includes(daysBetween(today, e.date)))
  const subs = await readSubs()
  if (events.length === 0 || subs.length === 0) return res.status(200).json({ ok: true, events: events.length, devices: subs.length, sent: 0 })

  const webpush = await configuredWebPush()
  const gone = new Set()
  let sent = 0
  for (const event of events) {
    const payload = JSON.stringify(reminderFor(event, daysBetween(today, event.date)))
    await Promise.all(
      subs.map((s) =>
        webpush
          .sendNotification({ endpoint: s.endpoint, keys: s.keys }, payload, { TTL: 60 * 60 * 12 })
          .then(() => sent++)
          .catch((err) => {
            if (err.statusCode === 404 || err.statusCode === 410) gone.add(s.endpoint) // device unsubscribed
          }),
      ),
    )
  }
  if (gone.size) await writeSubs(subs.filter((s) => !gone.has(s.endpoint)))

  return res.status(200).json({ ok: true, events: events.length, devices: subs.length, sent, removed: gone.size })
}
