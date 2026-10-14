import crypto from "crypto"

const SESSION_HOURS = 12

function base64url(input) {
  return Buffer.from(input).toString("base64url")
}

function sign(payload) {
  const secret = process.env.SESSION_SECRET
  const body = base64url(JSON.stringify(payload))
  const sig = crypto.createHmac("sha256", secret).update(body).digest("base64url")
  return `${body}.${sig}`
}

export function createToken() {
  const exp = Date.now() + SESSION_HOURS * 60 * 60 * 1000
  return sign({ exp })
}

export function verifyToken(token) {
  if (!token || typeof token !== "string" || !token.includes(".")) return false
  const [body, sig] = token.split(".")
  const secret = process.env.SESSION_SECRET
  const expected = crypto.createHmac("sha256", secret).update(body).digest("base64url")
  const sigBuf = Buffer.from(sig)
  const expBuf = Buffer.from(expected)
  if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) return false
  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8"))
    return typeof payload.exp === "number" && payload.exp > Date.now()
  } catch {
    return false
  }
}

function safeEqual(given, expected) {
  const a = Buffer.from(String(given || ""))
  const b = Buffer.from(String(expected || ""))
  if (a.length !== b.length) return false
  return crypto.timingSafeEqual(a, b)
}

// Officer credentials live in Vercel env vars (OFFICER_USERNAME / OFFICER_PASSWORD).
// If OFFICER_USERNAME isn't set yet, only the password is checked so the
// portal keeps working until the username is added.
export function checkCredentials(username, password) {
  const expectedPassword = process.env.OFFICER_PASSWORD || ""
  if (!expectedPassword) return false
  const passwordOk = safeEqual(password, expectedPassword)
  const expectedUsername = process.env.OFFICER_USERNAME || ""
  const usernameOk = expectedUsername
    ? safeEqual(String(username || "").trim().toLowerCase(), expectedUsername.trim().toLowerCase())
    : true
  return passwordOk && usernameOk
}

export function getBearerToken(req) {
  const header = req.headers.authorization || ""
  const [scheme, token] = header.split(" ")
  if (scheme !== "Bearer" || !token) return null
  return token
}
