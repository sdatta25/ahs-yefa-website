import webpush from "web-push"
import { readCollection, writeCollection } from "./store.js"

const KEYS = "secret/vapid-"
export const SUBS = "data/push-subs-"

// Web Push needs one key pair for the site. Use env vars if set; otherwise
// make a pair once and keep it in storage under an unguessable name.
export async function vapidKeys() {
  if (process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
    return { publicKey: process.env.VAPID_PUBLIC_KEY, privateKey: process.env.VAPID_PRIVATE_KEY }
  }
  const [saved] = await readCollection(KEYS)
  if (saved?.publicKey && saved?.privateKey) return saved
  const fresh = webpush.generateVAPIDKeys()
  await writeCollection(KEYS, [fresh], { secret: true })
  return fresh
}

export async function configuredWebPush() {
  const { publicKey, privateKey } = await vapidKeys()
  webpush.setVapidDetails("mailto:alpharettayefa@gmail.com", publicKey, privateKey)
  return webpush
}

export const readSubs = () => readCollection(SUBS)
export const writeSubs = (subs) => writeCollection(SUBS, subs, { secret: true })

export const EMAIL_SUBS = "data/email-subs-"
export const readEmailSubs = () => readCollection(EMAIL_SUBS)
export const writeEmailSubs = (subs) => writeCollection(EMAIL_SUBS, subs, { secret: true })
