import crypto from "crypto"
import { requireAuth, parseBody } from "./_lib/http.js"
import { readCollection, writeCollection } from "./_lib/store.js"

const PREFIX = "data/documents-"
const SECTIONS = new Set(["forms", "resources"])

function validateDoc(input) {
  if (!input || typeof input !== "object") return "Missing document"
  if (!SECTIONS.has(input.section)) return "Section must be 'forms' or 'resources'"
  if (!input.title || typeof input.title !== "string" || !input.title.trim()) return "Title is required"
  if (!input.url || typeof input.url !== "string" || !input.url.trim()) return "A link or uploaded file is required"
  return null
}

function sanitize(input) {
  return {
    section: input.section,
    title: input.title.trim(),
    description: typeof input.description === "string" ? input.description.trim() : "",
    url: input.url.trim(),
  }
}

export default async function handler(req, res) {
  if (req.method === "GET") {
    const docs = await readCollection(PREFIX)
    docs.sort((a, b) => a.title.localeCompare(b.title))
    return res.status(200).json({ documents: docs })
  }

  if (req.method === "POST") {
    if (!requireAuth(req, res)) return
    const body = parseBody(req)
    const error = validateDoc(body.document)
    if (error) return res.status(400).json({ error })

    const docs = await readCollection(PREFIX)
    const newDoc = { id: crypto.randomUUID(), ...sanitize(body.document) }
    docs.push(newDoc)
    await writeCollection(PREFIX, docs)
    return res.status(201).json({ documents: docs })
  }

  if (req.method === "PUT") {
    if (!requireAuth(req, res)) return
    const body = parseBody(req)
    if (!body.document || !body.document.id) return res.status(400).json({ error: "Missing document id" })
    const error = validateDoc(body.document)
    if (error) return res.status(400).json({ error })

    const docs = await readCollection(PREFIX)
    const idx = docs.findIndex((d) => d.id === body.document.id)
    if (idx === -1) return res.status(404).json({ error: "Document not found" })
    docs[idx] = { id: body.document.id, ...sanitize(body.document) }
    await writeCollection(PREFIX, docs)
    return res.status(200).json({ documents: docs })
  }

  if (req.method === "DELETE") {
    if (!requireAuth(req, res)) return
    const body = parseBody(req)
    if (!body.id) return res.status(400).json({ error: "Missing document id" })

    const docs = await readCollection(PREFIX)
    const next = docs.filter((d) => d.id !== body.id)
    await writeCollection(PREFIX, next)
    return res.status(200).json({ documents: next })
  }

  res.setHeader("Allow", "GET, POST, PUT, DELETE")
  return res.status(405).json({ error: "Method not allowed" })
}
