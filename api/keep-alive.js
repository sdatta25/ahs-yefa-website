import { createClient } from "@supabase/supabase-js"

// Free Supabase projects pause after 7 days without activity. Vercel Cron
// calls this once a day (see vercel.json); listing one user is a real
// database query, which counts as activity. Returns no user data.
export default async function handler(req, res) {
  // Vercel Cron sends this header when CRON_SECRET is set in the project.
  const cronSecret = process.env.CRON_SECRET
  if (cronSecret && req.headers.authorization !== `Bearer ${cronSecret}`) {
    return res.status(401).json({ error: "Unauthorized" })
  }

  const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL
  const secretKey =
    process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY
  if (!url || !secretKey) return res.status(500).json({ ok: false, error: "Supabase isn't configured" })

  const admin = createClient(url, secretKey, { auth: { persistSession: false, autoRefreshToken: false } })
  const { error } = await admin.auth.admin.listUsers({ page: 1, perPage: 1 })
  if (error) return res.status(502).json({ ok: false, error: "Supabase didn't answer" })

  return res.status(200).json({ ok: true, at: new Date().toISOString() })
}
