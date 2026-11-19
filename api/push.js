import { parseBody } from "./_lib/http.js"
import { getBearerToken } from "./_lib/auth.js"
import { userFromToken } from "./_lib/supabase-admin.js"
import { readSubs, vapidKeys, writeSubs, readEmailSubs, writeEmailSubs } from "./_lib/push.js"

// Meeting reminders.
//   GET    -> the public key browsers need to subscribe
//   POST   -> save this device's subscription (signed-in members only)
//   DELETE -> remove it
//   channel "email" -> GET/POST {on} for email reminders (signed-in members)
async function emailChannel(req, res, body) {
  const user = await userFromToken(getBearerToken(req))
  if (!user?.email) return res.status(401).json({ error: "Sign in again first." })
  const subs = await readEmailSubs()
  if (req.method === "GET") return res.status(200).json({ on: subs.some((s) => s.userId === user.id) })
  const rest = subs.filter((s) => s.userId !== user.id)
  if (body.on) rest.push({ userId: user.id, email: user.email, createdAt: new Date().toISOString() })
  await writeEmailSubs(rest)
  return res.status(200).json({ on: Boolean(body.on) })
}

export default async function handler(req, res) {
  if (req.query?.channel === "email") return emailChannel(req, res, parseBody(req))
  if (req.method === "GET") {
    const { publicKey } = await vapidKeys()
    return res.status(200).json({ publicKey })
  }

  const body = parseBody(req)
  const endpoint = body.subscription?.endpoint || body.endpoint
  if (typeof endpoint !== "string" || !endpoint.startsWith("https://")) {
    return res.status(400).json({ error: "Missing subscription" })
  }

  if (req.method === "DELETE") {
    const subs = await readSubs()
    const next = subs.filter((s) => s.endpoint !== endpoint)
    if (next.length !== subs.length) await writeSubs(next)
    return res.status(200).json({ ok: true })
  }

  if (req.method === "POST") {
    const user = await userFromToken(getBearerToken(req))
    if (!user) return res.status(401).json({ error: "Sign in again first." })
    const keys = body.subscription?.keys
    if (!keys?.p256dh || !keys?.auth) return res.status(400).json({ error: "Missing subscription keys" })

    const subs = (await readSubs()).filter((s) => s.endpoint !== endpoint)
    subs.push({ endpoint, keys: { p256dh: keys.p256dh, auth: keys.auth }, userId: user.id, email: user.email ?? "", createdAt: new Date().toISOString() })
    await writeSubs(subs)
    return res.status(201).json({ ok: true })
  }

  res.setHeader("Allow", "GET, POST, DELETE")
  return res.status(405).json({ error: "Method not allowed" })
}
