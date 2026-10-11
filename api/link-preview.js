import { put } from "@vercel/blob"
import { requireAuth, parseBody } from "./_lib/http.js"

function decodeEntities(str) {
  return str
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
}

function extractMeta(html, prop) {
  const re = new RegExp(`<meta property="${prop}" content="([^"]*)"`, "i")
  const m = html.match(re)
  return m ? decodeEntities(m[1]) : null
}

// Instagram's og:title looks like: Username on Instagram: "The actual caption"
function extractCaption(ogTitle) {
  if (!ogTitle) return ""
  const m = ogTitle.match(/"([^"]*)"\s*$/)
  return m ? m[1] : ogTitle
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST")
    return res.status(405).json({ error: "Method not allowed" })
  }
  if (!requireAuth(req, res)) return

  const body = parseBody(req)
  const url = typeof body.url === "string" ? body.url.trim() : ""
  if (!url || !/^https?:\/\//.test(url)) {
    return res.status(400).json({ error: "A valid link is required" })
  }

  let html
  try {
    const pageRes = await fetch(url, {
      // Social platforms generally only serve Open Graph preview tags to
      // known link-unfurling crawlers, not regular browser user agents.
      headers: { "User-Agent": "facebookexternalhit/1.1" },
      redirect: "follow",
    })
    if (!pageRes.ok) throw new Error("fetch failed")
    html = await pageRes.text()
  } catch {
    return res.status(502).json({ error: "Couldn't reach that link. Double-check the URL and try again." })
  }

  const ogTitle = extractMeta(html, "og:title")
  const ogImage = extractMeta(html, "og:image")
  const title = extractCaption(ogTitle)

  let image = ""
  if (ogImage) {
    try {
      const imgRes = await fetch(ogImage)
      if (imgRes.ok) {
        const buffer = Buffer.from(await imgRes.arrayBuffer())
        const contentType = imgRes.headers.get("content-type") || "image/jpeg"
        const ext = contentType.includes("png") ? "png" : "jpg"
        const blob = await put(`uploads/preview-${Date.now()}.${ext}`, buffer, {
          access: "public",
          addRandomSuffix: false,
          contentType,
        })
        image = blob.url
      }
    } catch {
      // Preview still works without the image — officer can upload one manually.
    }
  }

  if (!title && !image) {
    return res.status(502).json({ error: "Couldn't find a preview for that link." })
  }

  return res.status(200).json({ title, image })
}
