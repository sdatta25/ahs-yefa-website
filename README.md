# AHS YEFA Website

The official website for AHS YEFA (Youth Economics & Finance Association) — club info,
officer introductions, a meetings/competitions calendar, a competitions catalog, social
posts, sign-up forms, resources, and how to join.

Built with React + TypeScript + Vite + Tailwind CSS + Framer Motion, plus a small Vercel
Serverless API (`/api`) backed by Vercel Blob storage for the calendar, forms, and
resources, all managed through a password-protected Admin page. The homepage hero has a
real-time 3D scene (`@react-three/fiber` + `three`), lazy-loaded so it never blocks the
rest of the site and falls back to a static panel if WebGL isn't available or the visitor
has `prefers-reduced-motion` on.

## Running it locally

This project has a backend API (`/api`), so use the Vercel CLI dev server instead of plain
`vite dev` — it runs the frontend *and* the API routes together:

```bash
npm install
npx vercel dev
```

Then open the URL it prints. (Plain `npm run dev` also works but only for pages that don't
call the API — the calendar, Forms/Resources, and Admin page need `vercel dev` or a
deployed URL. Note: `vercel dev`'s local SPA rewrite emulation can misbehave on a hard
reload of a sub-page like `/admin` — if that happens, navigate to `/` first and click
through instead. This is a local-dev-only quirk; it doesn't happen on the real deployment.)

To build for production:

```bash
npm run build
```

## Project structure

```
src/
  components/
    admin/        AuthGate (login), EventManager (calendar CRUD), DocumentManager (forms/resources CRUD)
    hero3d/        The homepage's 3D hero scene (gem, orbit rings, parallax/scroll logic)
    BrandLogo, Navbar, Footer, EventCalendar, OfficerCard, PostCarousel, ...
  pages/           One file per page (Home, About, Officers, Calendar, Competitions, Forms, Resources, SocialMedia, Partners, Contact, Admin)
  data/            Editable content — site info, officer list, competitions catalog, partners
  lib/             api.ts (calls to /api), date.ts (calendar + Eastern Time formatting helpers)
public/images/     Logo images (Alpharetta HS crest + YEFA wordmark)
api/               Serverless functions: events.js, documents.js, upload.js, auth.js
```

## How to update content

- **Club name / tagline / contact email / Instagram** → edit `src/data/site.ts`.
- **Officers** (names, positions, photos, bios) → edit `src/data/officers.ts`. Each officer
  is one entry: `{ name, position, photo, bio }`. Drop photo files into `public/images/` and
  reference them like `photo: "/images/your-photo.jpg"`.
- **Calendar (meetings & competition deadlines), forms, resources, and social posts** →
  don't edit code for these — use the **Admin page** (see below). That's the whole point of it.
- **Competitions catalog** (the reference list on the Competitions page, separate from the
  dated Calendar) → edit `src/data/competitions.ts`, just a flat list of names.
- **Partners** → edit `src/data/partners.ts`.
- **About / mission text** → edit `src/pages/About.tsx` directly.
- **Logos** → replace `public/images/ahs-crest.png` and/or `public/images/yefa-wordmark.png`
  (same filenames) to update the combined logo everywhere (`BrandLogo.tsx` renders both).

After editing, run `npx vercel dev` to preview changes before publishing.

## Admin page

The Admin page lives at **`/admin`** — it is intentionally **not** in the main navigation
or listed anywhere members would stumble onto it, so regular visitors never see it. There's
a small "Officer Login" link in the footer for officers to find it. Officers sign in there
with a shared password, then manage everything from one place — changes go live on the
public site immediately, no redeploy needed:

- **Calendar** — add/edit/delete/pin meetings and competition deadlines. All times are
  entered and displayed in **Eastern Time**.
- **Forms** — add sign-up forms either by pasting a link (e.g. a Google Form) or uploading a
  file directly (max 4MB).
- **Resources** — same as Forms, but for the public Resources page.
- **Social Media** — add post previews (link to the Instagram post, plus optional preview
  images — select all images from a carousel post, in order, and they render as a
  swipeable carousel on the Social Media page). Pin one to keep it first and
  delete-protected.

Notes:

- The password is **not stored in the code** — it's a Vercel environment variable called
  `OFFICER_PASSWORD`, set in the Vercel project dashboard (Project → Settings →
  Environment Variables). To change it, update that value there and redeploy.
- `SESSION_SECRET` (also an env var) signs officer login sessions — don't need to touch it
  unless you want to invalidate all logged-in officers at once (change it and everyone is
  logged out).
- All data (calendar items, forms, resources, uploaded files) is stored in **Vercel Blob**
  storage, automatically provisioned for this project — no separate database to manage.

## Deploying

This project is deployed on **Vercel** (not just any static host, since it needs the
`/api` serverless functions and Blob storage):

- Production: https://ahsyefa.vercel.app
- Connected to this GitHub repo — every push to `main` auto-deploys.

## Giving someone else access

1. Add them as a collaborator on this GitHub repo (Settings → Collaborators).
2. Add them to the Vercel project (Vercel dashboard → Project → Settings → Members).
3. Share the Admin password separately (not through GitHub/this README), and let them know
   the Admin page is at `/admin` (or the "Officer Login" link in the footer).
4. Point them to this README for how the content is organized.
