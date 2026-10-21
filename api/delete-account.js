import { createClient } from "@supabase/supabase-js"
import { getBearerToken } from "./_lib/auth.js"

// Deletes the signed-in member's own Supabase account. Deleting a user needs
// Supabase's secret key, so it can't happen in the browser; the member's
// access token proves which account to delete.
export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST")
    return res.status(405).json({ error: "Method not allowed" })
  }

  // Prefer the URL the site itself signs in with, so the key and the
  // member's token belong to the same project. Accept the key under the
  // names Supabase's Vercel integration uses too.
  const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL
  const secretKey =
    process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY
  if (!url || !secretKey) {
    return res.status(500).json({ error: "Account deletion isn't set up yet. Ask an officer." })
  }

  const token = getBearerToken(req)
  if (!token) return res.status(401).json({ error: "Sign in again first." })

  const admin = createClient(url, secretKey, { auth: { persistSession: false, autoRefreshToken: false } })

  const { data, error } = await admin.auth.getUser(token)
  if (error || !data.user) return res.status(401).json({ error: "Your session expired. Sign in again first." })

  const { error: deleteError } = await admin.auth.admin.deleteUser(data.user.id)
  if (deleteError) return res.status(500).json({ error: "Couldn't delete your account. Try again." })

  return res.status(200).json({ ok: true })
}
