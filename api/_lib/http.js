import { verifyToken, getBearerToken } from "./auth.js"

export function requireAuth(req, res) {
  const token = getBearerToken(req)
  if (!verifyToken(token)) {
    res.status(401).json({ error: "Unauthorized" })
    return false
  }
  return true
}

export function parseBody(req) {
  let body = req.body
  if (typeof body === "string") {
    try {
      body = JSON.parse(body)
    } catch {
      return {}
    }
  }
  return body || {}
}
