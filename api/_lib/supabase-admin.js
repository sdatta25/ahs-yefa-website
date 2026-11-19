import { createClient } from "@supabase/supabase-js"

// Server-side Supabase client with the secret key, or null if not set up.
export function supabaseAdmin() {
  const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL
  const key =
    process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY
  if (!url || !key) return null
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } })
}

// The signed-in member behind a Supabase access token, or null.
export async function userFromToken(token) {
  const admin = supabaseAdmin()
  if (!admin || !token) return null
  const { data, error } = await admin.auth.getUser(token)
  return error ? null : data.user
}
