# Flowly — SaaS Landing Page

A fictional team / project management SaaS landing page, designed and developed as a personal frontend portfolio project.

Flowly is **not a real company or live service**. It is a concept project built to demonstrate responsive landing-page design, clean frontend architecture, and accessible interactive UI with HTML, CSS, and vanilla JavaScript.

## Project Overview

Flowly is a fictional productivity SaaS platform concept designed to help teams manage:

- projects
- tasks
- deadlines
- team communication
- progress
- workload

The goal of the project was to create a polished, responsive, conversion-focused SaaS landing page — from navbar and hero through features, workflow, social proof, pricing, FAQ, and final call-to-action — with a custom product dashboard UI built in pure HTML/CSS.

## Live Demo

[Live Demo](https://youssefmohammed12.github.io/Flowly/)

## Screenshots

> Screenshots are added manually. The files below are the expected captures in `screenshots/`.

### Desktop

![Flowly desktop hero](screenshots/hero-desktop.png)

![Flowly full page desktop](screenshots/full-page-desktop.png)

### Mobile

![Flowly mobile home](screenshots/mobile-home.png)

![Flowly mobile menu](screenshots/mobile-menu.png)

### Interactive UI

![Flowly product demo modal](screenshots/product-demo.png)

![Flowly login modal](screenshots/login-modal.png)

![Flowly signup modal](screenshots/signup-modal.png)

![Flowly pricing section](screenshots/pricing.png)

## Features

- Responsive SaaS landing page
- Custom Flowly product dashboard UI
- Interactive product demo modal
- Login prototype modal
- Signup prototype modal
- Monthly / annual pricing toggle
- FAQ accordion
- Responsive mobile navigation
- Product UI microinteractions
- Scroll reveal animations
- Animated product facts
- Newsletter frontend prototype
- Accessible modal interactions
- Keyboard-friendly interactions
- Reduced-motion support
- Responsive layouts

## Technologies

- HTML5
- CSS3
- Vanilla JavaScript
- Bootstrap 5.3.3 CSS (layout / utilities only — no Bootstrap JS bundle)
- Google Fonts (Inter + Poppins)
- Git / GitHub
- GitHub Pages

## Project Structure

```text
Flowly/
├── index.html
├── css/
│   └── styles.css
├── js/
│   └── script.js
├── images/
│   ├── og-image.png
│   └── favicon/
│       ├── favicon.svg
│       ├── favicon-32x32.png
│       └── apple-touch-icon.png
├── screenshots/
│   ├── hero-desktop.png
│   ├── full-page-desktop.png
│   ├── mobile-home.png
│   ├── mobile-menu.png
│   ├── product-demo.png
│   ├── login-modal.png
│   ├── signup-modal.png
│   └── pricing.png
└── README.md
```

## Design / UX

- SaaS-focused visual identity with a clean, calm workspace feel
- Product-first visuals: dashboard previews lead the hero and supporting sections
- Responsive layout (desktop-first sections that collapse cleanly on mobile)
- Clear CTA hierarchy (`Start Free Trial` primary, `Watch Demo` secondary)
- Lightweight animations (reveals, counters, product transitions) that support content
- Consistent UI system (buttons, badges, cards, modals, spacing)
- Accessibility considerations baked into navigation, modals, and motion

## Interactions

- Mobile navigation (hamburger toggle + drawer, closes on link click / resize)
- Pricing toggle (monthly / annual billing switch with updated amounts)
- FAQ accordion (single-open behavior with ARIA expanded states)
- Watch Demo modal (tabbed Board / Timeline / Chat product preview)
- Login prototype (frontend-only validation + demo feedback)
- Signup prototype (plan-aware heading + frontend-only validation + success state)
- Password visibility toggle (show / hide on auth forms)
- Form validation (native + custom frontend messages, newsletter included)
- Scroll-based animations (IntersectionObserver reveals, animated stats counters)
- Product preview transitions (demo view switching, subtle dashboard motion)

## Accessibility

- Semantic HTML (`header`, `main`, `section`, labelled headings, native buttons/forms)
- Visible focus states
- ARIA states / labels where appropriate (`aria-label`, `aria-expanded`, `aria-haspopup="dialog"`, `role="dialog"`, `aria-modal`)
- Keyboard-accessible interactions (all actions reachable and operable by keyboard)
- Modal focus handling (focus moved into dialog, trapped while open, restored on close)
- Escape-to-close behavior (modals and mobile menu)
- Reduced-motion support (`prefers-reduced-motion` disables reveals, counters, and decorative motion)

No WCAG certification is claimed.

## SEO / Metadata

The page includes:

- Page `<title>`
- Meta description
- Open Graph metadata (`og:title`, `og:description`, `og:type`, `og:url`, `og:image` 1200×630)
- Twitter/X card metadata (`summary_large_image`)
- Canonical URL: `https://youssefmohammed12.github.io/Flowly/`
- Favicon (SVG + 32×32 PNG)
- Apple touch icon
- `theme-color` meta
- OG image: `https://youssefmohammed12.github.io/Flowly/images/og-image.png`

## Deployment

Static site deployed with GitHub Pages from the repository.

Live URL: [https://youssefmohammed12.github.io/Flowly/](https://youssefmohammed12.github.io/Flowly/)

## Disclaimer

"Flowly is a fictional product concept created for portfolio and learning purposes. The testimonials, branding, product features, pricing, and other business content are illustrative and do not represent a real company or service."
