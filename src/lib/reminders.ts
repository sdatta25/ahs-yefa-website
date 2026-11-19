import { supabase } from "./supabase"

// Meeting reminders use Web Push: the browser gives us a subscription for
// this device, the server stores it, and a daily job sends the reminders.

export type ReminderSupport = "ok" | "unsupported" | "ios-install" | "blocked"

function isIos() {
  return /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
}
function isInstalled() {
  return window.matchMedia("(display-mode: standalone)").matches || (navigator as { standalone?: boolean }).standalone === true
}

export function reminderSupport(): ReminderSupport {
  const capable = "serviceWorker" in navigator && "PushManager" in window && "Notification" in window
  if (!capable) return isIos() && !isInstalled() ? "ios-install" : "unsupported"
  if (Notification.permission === "denied") return "blocked"
  return "ok"
}

async function registration() {
  return (await navigator.serviceWorker.getRegistration()) ?? (await navigator.serviceWorker.register("/sw.js"))
}

export async function remindersOn(): Promise<boolean> {
  if (reminderSupport() !== "ok") return false
  const reg = await navigator.serviceWorker.getRegistration()
  return Boolean(reg && (await reg.pushManager.getSubscription()))
}

function keyBytes(base64url: string) {
  const pad = "=".repeat((4 - (base64url.length % 4)) % 4)
  const raw = atob((base64url + pad).replace(/-/g, "+").replace(/_/g, "/"))
  return Uint8Array.from(raw, (c) => c.charCodeAt(0))
}

export async function turnOnReminders() {
  if ((await Notification.requestPermission()) !== "granted") {
    throw new Error("Notifications are blocked. Allow them for this site in your browser settings, then try again.")
  }
  const reg = await registration()
  await navigator.serviceWorker.ready
  const { publicKey } = await fetch("/api/push").then((r) => r.json())
  const subscription =
    (await reg.pushManager.getSubscription()) ??
    (await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: keyBytes(publicKey) }))

  const { data } = await supabase.auth.getSession()
  const res = await fetch("/api/push", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${data.session?.access_token ?? ""}` },
    body: JSON.stringify({ subscription: subscription.toJSON() }),
  })
  if (!res.ok) {
    await subscription.unsubscribe().catch(() => {})
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error || "Couldn't turn on reminders. Try again.")
  }
}

export async function turnOffReminders() {
  const reg = await navigator.serviceWorker.getRegistration()
  const subscription = await reg?.pushManager.getSubscription()
  if (!subscription) return
  await fetch("/api/push", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ endpoint: subscription.endpoint }),
  }).catch(() => {})
  await subscription.unsubscribe()
}
