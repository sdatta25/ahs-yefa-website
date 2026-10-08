import { createToken, checkPassword } from "./_lib/auth.js"

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST")
    return res.status(405).json({ error: "Method not allowed" })
  }

  let body = req.body
  if (typeof body === "string") {
    try {
      body = JSON.parse(body)
    } catch {
      body = {}
    }
  }
  const password = body && body.password

  if (!password || !checkPassword(password)) {
    return res.status(401).json({ error: "Incorrect password" })
  }

  return res.status(200).json({ token: createToken() })
}
