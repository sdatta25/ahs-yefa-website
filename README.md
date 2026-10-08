# AHS YEFA Website

The official website for AHS YEFA (Youth Economics & Finance Association) — club info,
officer introductions, a meetings/competitions calendar, and how to join.

Built with React + TypeScript + Vite + Tailwind CSS + Framer Motion, plus a small Vercel
Serverless API (`/api`) backed by Vercel Blob storage for the meetings/competitions
calendar and the password-protected Officer Portal.

## Running it locally

This project has a backend API (`/api`), so use the Vercel CLI dev server instead of plain
`vite dev` — it runs the frontend *and* the API routes together:

```bash
npm install
npx vercel dev
```

Then open the URL it prints. (Plain `npm run dev` also works but only for pages that don't
call the API — the calendar and Officer Portal need `vercel dev` or a deployed URL.)

To build for production:

```bash
npm run build
```

## Project structure

```
src/
  components/   Navbar, Footer, BrandLogo, TiltCard, EventCalendar, OfficerPortal, ...
  pages/        One file per page (Home, About, Officers, MeetingsCompetitions, Forms, Resources, Contact)
  data/         Editable content — site info, officer list
  lib/          api.ts (calls to /api), date.ts (calendar + Eastern Time formatting helpers)
public/images/  Logo images (Alpharetta HS crest + YEFA wordmark)
api/            Serverless functions: events.js (calendar CRUD), auth.js (officer login)
```

## How to update content

- **Club name / tagline / contact email / Instagram** → edit `src/data/site.ts`.
- **Officers** (names, positions, photos, bios) → edit `src/data/officers.ts`. Each officer
  is one entry: `{ name, position, photo, bio }`. Drop photo files into `public/images/` and
  reference them like `photo: "/images/your-photo.jpg"`.
- **Meetings & competitions** → don't edit code for these — use the **Officer Portal**
  (see below). It's the whole point of that page.
- **About / mission text** → edit `src/pages/About.tsx` directly.
- **Logos** → replace `public/images/ahs-crest.png` and/or `public/images/yefa-wordmark.png`
  (same filenames) to update the combined logo everywhere (`BrandLogo.tsx` renders both).

After editing, run `npx vercel dev` to preview changes before publishing.

## Officer Portal

On the **Officers** page, there's a collapsed "Officer Portal" section at the bottom.
Officers log in there with a shared password to add, edit, and delete meetings and
competitions — these immediately show up on the public **Meetings & Competitions**
calendar for everyone. All times are entered and displayed in **Eastern Time**.

- The password is **not stored in the code** — it's a Vercel environment variable called
  `OFFICER_PASSWORD`, set in the Vercel project dashboard (Project → Settings →
  Environment Variables). To change it, update that value there and redeploy.
- `SESSION_SECRET` (also an env var) signs officer login sessions — don't need to touch it
  unless you want to invalidate all logged-in officers at once (change it and everyone is
  logged out).
- Calendar data is stored in **Vercel Blob** storage (a small JSON file), automatically
  provisioned for this project — no separate database to manage.

## Officer photos — placeholders

The Officers grid currently uses placeholder names/positions. Once the officer
introduction posts are shared, update `src/data/officers.ts` with real names, positions,
and photos.

## Deploying

This project is deployed on **Vercel** (not just any static host, since it needs the
`/api` serverless functions and Blob storage):

- Production: https://ahsyefa.vercel.app
- Connected to this GitHub repo — every push to `main` auto-deploys.

## Giving someone else access

1. Add them as a collaborator on this GitHub repo (Settings → Collaborators).
2. Add them to the Vercel project (Vercel dashboard → Project → Settings → Members).
3. Share the Officer Portal password separately (not through GitHub/this README).
4. Point them to this README for how the content is organized.
