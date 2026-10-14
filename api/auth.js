import { createToken, checkCredentials } from "./_lib/auth.js"

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
  const username = body && body.username
  const password = body && body.password

  if (!password || !checkCredentials(username, password)) {
    return res.status(401).json({ error: "Incorrect username or password" })
  }

  return res.status(200).json({ token: createToken() })
}
