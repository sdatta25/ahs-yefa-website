import { createClient } from "@supabase/supabase-js"

const url = import.meta.env.VITE_SUPABASE_URL
const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

if (!url || !publishableKey) {
  throw new Error("Missing VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY")
}

// Sessions live in sessionStorage, so closing the browser (or opening a new
// profile or window) means signing in again.
// Clear logins saved permanently by older versions of the site.
try {
  for (const key of Object.keys(localStorage)) {
    if (key.startsWith("sb-") || key === "yefa_officer_token") localStorage.removeItem(key)
  }
} catch {
  // storage blocked: nothing to clear
}

export const supabase = createClient(url, publishableKey, {
  auth: { storage: window.sessionStorage, persistSession: true },
})

