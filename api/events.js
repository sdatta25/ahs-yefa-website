import crypto from "crypto"
import { requireAuth, parseBody } from "./_lib/http.js"
import { readCollection, writeCollection } from "./_lib/store.js"

const PREFIX = "data/events-"
const TYPES = new Set(["meeting", "competition"])
const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/

function validateEvent(input) {
  if (!input || typeof input !== "object") return "Missing event"
  if (!TYPES.has(input.type)) return "Type must be 'meeting' or 'competition'"
  if (!input.title || typeof input.title !== "string" || !input.title.trim()) return "Title is required"
  if (!DATE_RE.test(input.date)) return "Date must be in YYYY-MM-DD format"
  if (!TIME_RE.test(input.time)) return "Time must be in HH:MM (24h) format"
  return null
}

function sanitize(input) {
  return {
    type: input.type,
    title: input.title.trim(),
    date: input.date,
    time: input.time,
    location: typeof input.location === "string" ? input.location.trim() : "",
    description: typeof input.description === "string" ? input.description.trim() : "",
  }
}

export default async function handler(req, res) {
  if (req.method === "GET") {
    const events = await readCollection(PREFIX)
    events.sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))
    return res.status(200).json({ events })
  }

  if (req.method === "POST") {
    if (!requireAuth(req, res)) return
    const body = parseBody(req)
    const error = validateEvent(body.event)
    if (error) return res.status(400).json({ error })

    const events = await readCollection(PREFIX)
    const newEvent = { id: crypto.randomUUID(), ...sanitize(body.event) }
    events.push(newEvent)
    await writeCollection(PREFIX, events)
    return res.status(201).json({ events })
  }

  if (req.method === "PUT") {
    if (!requireAuth(req, res)) return
    const body = parseBody(req)
    if (!body.event || !body.event.id) return res.status(400).json({ error: "Missing event id" })
    const error = validateEvent(body.event)
    if (error) return res.status(400).json({ error })

    const events = await readCollection(PREFIX)
    const idx = events.findIndex((e) => e.id === body.event.id)
    if (idx === -1) return res.status(404).json({ error: "Event not found" })
    events[idx] = { id: body.event.id, ...sanitize(body.event) }
    await writeCollection(PREFIX, events)
    return res.status(200).json({ events })
  }

  if (req.method === "DELETE") {
    if (!requireAuth(req, res)) return
    const body = parseBody(req)
    if (!body.id) return res.status(400).json({ error: "Missing event id" })

    const events = await readCollection(PREFIX)
    const next = events.filter((e) => e.id !== body.id)
    await writeCollection(PREFIX, next)
    return res.status(200).json({ events: next })
  }

  res.setHeader("Allow", "GET, POST, PUT, DELETE")
  return res.status(405).json({ error: "Method not allowed" })
}
