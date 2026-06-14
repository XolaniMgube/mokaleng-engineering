# Mokaleng — Website (v1, static multi-page)

Premium, responsive marketing site for **Mokaleng Engineering Projects (Pty) Ltd**.
Built as plain HTML/CSS/JS — no build step, deploys anywhere (Netlify, Vercel,
cPanel, S3, GitHub Pages). Just upload the folder.

## Pages
`index` · `about` · `services` · `sectors` · `certifications` · `projects` · `clients` · `contact`

## How the contact form works (no backend)
On submit, the form validates required fields + POPIA consent, then opens the
visitor's email client with the enquiry pre-filled (to `Info@mokaleng.co.za`) and
shows a one-tap **WhatsApp** option (to +27 82 727 2851). Nothing is stored on the
site. To switch to a real backend later (e.g. Formspree / Web3Forms), point the
form handler in `assets/js/main.js` at your endpoint.

## What to swap in (placeholders are clearly labelled)
All imagery is currently generated SVG placeholders in the brand style, each
marked "PLACEHOLDER · SWAP REAL PHOTO".

| Replace | Location | Notes |
|---|---|---|
| Hero / section photos | `assets/img/*.svg` | Drop real JPGs with the same filename (change `.svg`→`.jpg` in the HTML), or overwrite the SVGs. Recommended: refinery/piping/welding/structural photography. |
| Logo | inline SVG in header/footer | Currently a styled "M" mark. Replace with the official Mokaleng logo (SVG/PNG). |
| Certificate thumbnails | `certifications.html` | Swap the styled cert cards for real certificate images (`assets/img/cert-*.jpg`). |
| B-BBEE badges | `certifications.html` | Replace the Level 1 / Level 2 placeholder badges with the official supplied badges. |
| Client logos | `clients.html` + homepage grid | Currently text placeholders. Drop real logo files into `assets/img/clients/`. |

## Content integrity
No fake testimonials, project stats, dates, locations, certifications or client
relationships were invented. Certifications shown (ISO 9001 / 14001 / 45001 /
3834-2) and clients are taken directly from the supplied business profile.

## Brand tokens (in `assets/css/style.css` `:root`)
navy `#0A1C26` · teal `#0F6E6E` · teal-300 `#2EA3A3` · industrial blue `#1A56DB`
· steel `#8A99A6` · safety orange `#F26A21` (accent only) · bone `#F4F6F7`.
Type: Archivo (display) · Inter (body) · IBM Plex Mono (technical labels).

## Accessibility & performance
Semantic HTML, keyboard-accessible nav + form, visible focus states, alt text,
reduced-motion support, no heavy libraries, system fonts fallback.

## Optional next step
This can be converted to the Next.js + TypeScript + Tailwind architecture from the
original brief (component-based: Header, Footer, HeroSection, ServiceCard, etc.)
without changing the visual design.
# mokaleng-engineering
