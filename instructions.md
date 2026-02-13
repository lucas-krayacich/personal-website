# Personal Website Build Specification

## Overview

Build a **minimal, modern, high-performance personal website** from scratch using the contents of this empty Git repository.

The site should function as:

1. A clean, professional resume  
2. A curated gallery of projects and experiments  
3. A small interactive playground showcasing 1–2 elegant digital assets  

The overall feel should be:

- Minimal  
- Calm  
- Technically sharp  
- Not corporate  
- Not template-y  
- Inspired by modern indie developer portfolios  

Think: understated confidence, strong typography, subtle motion.

---

## Technical Constraints

- Hosted on **Netlify free tier**
- Deployed via GitHub (Netlify pulls from `main`)
- Fully static site (no backend/server required)
- Fast load times
- Mobile-first responsive
- Basic accessibility best practices (semantic HTML, alt tags, etc.)

---

## Tech Stack

Choose one and briefly justify the choice before implementing:

- **Option A:** Next.js (static export)
- **Option B:** Astro
- **Option C:** Vite + React
- **Option D:** Pure HTML/CSS/JS (if justified)

Keep dependencies minimal and performance high.

---

## Site Structure

### 1. Hero Section (Highest Priority)

The landing page must include:

- Large name header
- 1–2 sentence identity statement
- Subtle animated or interactive background
- Minimal call-to-action buttons (e.g., “Projects”, “Resume”, “Contact”)

The hero must contain **at least one elegant interactive digital element**, such as:

- Mouse-reactive particle field  
- Interactive grid that lights up  
- Subtle physics animation  
- Canvas-based generative pattern  
- Typographic animation  

Design requirement: restrained, elegant, not flashy.

---

### 2. Projects / Gallery Section

- Grid-based layout
- Clean project cards
- Subtle hover effects
- Strong use of whitespace

Each project card should include:

- Title
- Short description
- Tech stack
- External link (if applicable)

---

### 3. Resume Section

Structured but visually refined:

- Experience
- Education
- Skills
- Optional downloadable PDF

Avoid generic bullet-dump layout. Keep it clean and intentional.

---

### 4. Playground / Experiments Section

A section for:

- Creative coding experiments
- Mini ML visualizations
- Generative art
- Interactive demos

Each experiment should live in its own component/module.

---

## Design Direction

- Typography-forward
- Maximum 1–2 fonts
- Neutral color palette + one accent color
- Subtle motion (e.g., Framer Motion if using React)
- No Bootstrap or heavy UI frameworks

Visual tone:

- Modern indie developer
- Slightly artistic
- Clean but warm
- Understated confidence

---

## Animation & Interactivity Requirements

- Smooth scrolling
- Subtle hover animations
- Hero interactive element
- No performance lag on low-powered devices


