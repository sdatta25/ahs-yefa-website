import { put } from "@vercel/blob"
import { requireAuth, parseBody } from "./_lib/http.js"

const MAX_BYTES = 4 * 1024 * 1024

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST")
    return res.status(405).json({ error: "Method not allowed" })
  }

  if (!requireAuth(req, res)) return

  const body = parseBody(req)
  const { filename, contentType, dataBase64 } = body

  if (!filename || typeof filename !== "string") {
    return res.status(400).json({ error: "Missing filename" })
  }
  if (!dataBase64 || typeof dataBase64 !== "string") {
    return res.status(400).json({ error: "Missing file data" })
  }

  let buffer
  try {
    buffer = Buffer.from(dataBase64, "base64")
  } catch {
    return res.status(400).json({ error: "Invalid file data" })
  }

  if (buffer.length > MAX_BYTES) {
    return res.status(400).json({ error: "File is too large (max 4MB)" })
  }

  const safeName = filename.replace(/[^a-zA-Z0-9._-]/g, "_")
  const pathname = `uploads/${Date.now()}-${safeName}`

  const blob = await put(pathname, buffer, {
    access: "public",
    addRandomSuffix: false,
    contentType: contentType || "application/octet-stream",
  })

  return res.status(201).json({ url: blob.url })
}
