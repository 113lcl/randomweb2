# OBSIDIAN — Architectural Atelier

A multi-page luxury landing site for a fictional private architecture studio. All content is for demonstration purposes.

## Stack
Plain HTML/CSS/JS, no build step or dependencies — open directly or deploy to GitHub Pages.

## Pages
- `index.html` — Home
- `about.html` — Philosophy, values, timeline, team
- `residences.html` — Portfolio grid with category filters
- `residence-obsidian.html`, `residence-pavilion.html` — Individual project pages (gallery, specs, lightbox)
- `services.html` — Process, pricing tiers, FAQ accordion
- `journal.html` + `journal-light.html`, `journal-materials.html`, `journal-privacy.html` — Editorial journal & articles
- `contact.html` — Contact form, offices, map

## Interactive features
- Custom cursor with magnetic buttons
- 3D tilt on cards
- Scroll reveal animations (IntersectionObserver)
- Animated stat counters
- Marquee ticker
- Day/night comparison slider (draggable)
- Light/dark theme toggle (persisted via localStorage)
- Category filter tabs (residences)
- FAQ accordion (services)
- Image lightbox (project galleries & articles)
- Parallax hero image, preloader, scroll progress bar, scroll-to-top button
- Easter egg: Konami code

## Local run
Open `index.html` directly, or serve statically:

```bash
npx serve .
```

## Deploy to GitHub Pages
1. Push the contents of this folder to a repository.
2. In the repo settings, enable Pages → Source: `main` / root.
