import nodemailer from "nodemailer"

// Sends mail as the club Gmail (SMTP_USER / SMTP_PASS in Vercel, an app
// password). Returns null when those aren't set.
let transport = null
export function mailer() {
  const user = process.env.SMTP_USER
  const pass = (process.env.SMTP_PASS || "").replace(/\s+/g, "")
  if (!user || !pass) return null
  transport ??= nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT || 465),
    secure: Number(process.env.SMTP_PORT || 465) === 465,
    auth: { user, pass },
  })
  return transport
}

export async function sendMail({ to, subject, text, html, replyTo }) {
  const m = mailer()
  if (!m) throw new Error("Email isn't set up (SMTP_USER / SMTP_PASS)")
  return m.sendMail({ from: `"AHS YEFA X YEI" <${process.env.SMTP_USER}>`, to, subject, text, html, replyTo })
}

const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c])

// A plain, branded email body.
export function emailHtml({ heading, lines = [], button }) {
  const site = process.env.SITE_URL || "https://ahsyefaandyei.vercel.app"
  return `<div style="font-family:Arial,sans-serif;max-width:520px;margin:0 auto;color:#0f1b3d">
  <p style="font-weight:800;font-size:18px;margin:0 0 16px">AHS YEFA X YEI</p>
  <h2 style="font-size:22px;margin:0 0 12px">${esc(heading)}</h2>
  ${lines.map((l) => `<p style="font-size:15px;line-height:1.5;color:#4b5572;margin:0 0 8px">${esc(l)}</p>`).join("")}
  ${button ? `<p style="margin:20px 0"><a href="${site}${button.path}" style="background:#2b4fc2;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none;font-weight:600">${esc(button.label)}</a></p>` : ""}
  <p style="font-size:12px;color:#8e97b0;margin-top:24px">You get this because you turned on email reminders. Turn them off under Account on the website.</p>
</div>`
}
