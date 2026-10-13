import { createClient } from "@supabase/supabase-js"

const url = import.meta.env.VITE_SUPABASE_URL
const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

if (!url || !publishableKey) {
  throw new Error("Missing VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY")
}

export const supabase = createClient(url, publishableKey)

// Members must sign up with this domain. Leave empty to allow any email —
// set once the school's Google Workspace domain is confirmed.
export const ALLOWED_EMAIL_DOMAIN = import.meta.env.VITE_ALLOWED_EMAIL_DOMAIN || ""

export function isAllowedEmail(email: string): boolean {
  if (!ALLOWED_EMAIL_DOMAIN) return true
  return email.toLowerCase().endsWith(ALLOWED_EMAIL_DOMAIN.toLowerCase())
}
