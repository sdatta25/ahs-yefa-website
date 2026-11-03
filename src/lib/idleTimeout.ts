import { useEffect } from "react"
import { supabase } from "./supabase"
import { clearToken, hasToken } from "./api"

// Signs members and officers out after 30 minutes with no activity. The last
// activity time lives in localStorage, so it is shared across tabs and
// survives a closed tab: reopening the site an hour later signs you out too.
const IDLE_MS = 30 * 60 * 1000
const CHECK_MS = 30 * 1000
const WRITE_EVERY_MS = 15 * 1000
const LAST_ACTIVE_KEY = "yefa_last_active"
const NOTICE_KEY = "yefa_idle_signed_out"
const ACTIVITY_EVENTS = ["pointerdown", "keydown", "scroll", "touchstart", "mousemove"] as const

export const OFFICER_LOGOUT_EVENT = "yefa:officer-logout"

function readLastActive(): number | null {
  try {
    const value = Number(localStorage.getItem(LAST_ACTIVE_KEY))
    return value > 0 ? value : null
  } catch {
    return null
  }
}

function writeLastActive(time: number) {
  try {
    localStorage.setItem(LAST_ACTIVE_KEY, String(time))
  } catch {
    // Storage blocked: the timeout just won't survive a reload.
  }
}

// Shows "signed out for inactivity" once on the next sign-in screen.
export function takeIdleNotice(): boolean {
  try {
    const shown = sessionStorage.getItem(NOTICE_KEY) === "1"
    sessionStorage.removeItem(NOTICE_KEY)
    return shown
  } catch {
    return false
  }
}

async function signOutIfIdle() {
  const last = readLastActive()
  if (last === null || Date.now() - last < IDLE_MS) return

  const { data } = await supabase.auth.getSession()
  const member = Boolean(data.session)
  const officer = hasToken()
  if (!member && !officer) return

  try {
    sessionStorage.setItem(NOTICE_KEY, "1")
  } catch {
    // ignore
  }
  if (officer) {
    clearToken()
    window.dispatchEvent(new Event(OFFICER_LOGOUT_EVENT))
  }
  if (member) await supabase.auth.signOut()
}

export function useIdleSignOut() {
  useEffect(() => {
    let lastWrite = 0
    const markActive = () => {
      const now = Date.now()
      if (now - lastWrite < WRITE_EVERY_MS) return
      lastWrite = now
      writeLastActive(now)
    }

    // Arriving back from Google or an email sign-in link counts as activity,
    // so a fresh sign-in isn't undone by an old timestamp.
    const { search, hash } = window.location
    if (/[?&#](code|access_token|token_hash)=/.test(search + hash)) markActive()

    // Nothing recorded yet (first visit after this shipped): start the clock.
    if (readLastActive() === null) writeLastActive(Date.now())
    void signOutIfIdle()

    for (const name of ACTIVITY_EVENTS) window.addEventListener(name, markActive, { passive: true })
    const timer = window.setInterval(() => void signOutIfIdle(), CHECK_MS)
    const onVisible = () => {
      if (document.visibilityState === "visible") void signOutIfIdle()
    }
    document.addEventListener("visibilitychange", onVisible)

    return () => {
      for (const name of ACTIVITY_EVENTS) window.removeEventListener(name, markActive)
      window.clearInterval(timer)
      document.removeEventListener("visibilitychange", onVisible)
    }
  }, [])
}
