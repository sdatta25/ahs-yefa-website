export const SITE = {
  shortName: "AHS YEFA",
  fullName: "AHS YEFA",
  tagline: "Building the next generation of economists, investors, and leaders.",
  contactEmail: "alpharettayefa@gmail.com",
  instagram: "https://www.instagram.com/alpharettayefa/",
  memberSignupForm: "https://forms.gle/XJc52ZqHQQbmuN3cA",
}

// Shown directly in the navbar.
export const NAV_PRIMARY = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Officers", to: "/officers" },
  { label: "Meetings & Competitions", to: "/meetings-competitions" },
]

// Tucked under the "More" dropdown on desktop (still flat on mobile).
export const NAV_MORE = [
  { label: "Forms", to: "/forms" },
  { label: "Resources", to: "/resources" },
  { label: "Social Media", to: "/social" },
  { label: "Partners", to: "/partners" },
]

// Full flat list — used for the mobile menu and the footer.
export const NAV_LINKS = [...NAV_PRIMARY, ...NAV_MORE, { label: "Join", to: "/contact" }]
