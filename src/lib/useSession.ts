import { useEffect, useState } from "react"
import type { Session, User } from "@supabase/supabase-js"
import { supabase } from "./supabase"

export function useSession() {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  return { session, loading }
}

// Best name to greet a signed-in user by. Google sign-ins carry the account's
// full name in user_metadata; email-code sign-ins fall back to the email's
// local part (e.g. "jane.doe" → "Jane Doe").
export function displayName(user: User | null | undefined): string {
  if (!user) return ""
  const meta = user.user_metadata || {}
  const fromMeta = meta.full_name || meta.name
  if (typeof fromMeta === "string" && fromMeta.trim()) return fromMeta.trim()
  const local = (user.email || "").split("@")[0]
  return local
    .split(/[._-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")
}

export function firstName(user: User | null | undefined): string {
  return displayName(user).split(" ")[0]
}
