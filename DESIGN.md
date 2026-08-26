# Kush Dental Clinic - Design System & Architecture

This document outlines the core design philosophy, color palettes, typography, and interactive patterns used across the Kush Dental Clinic website. 

## 1. Core Aesthetic
**Theme**: "Clinical Luxury"
The website uses a high-end, minimalist aesthetic that inspires trust, hygiene, and premium care. It relies heavily on generous whitespace, large and legible typography, and smooth micro-interactions.

## 2. Color Palette
The color system is mapped in `tailwind.config.ts`:
- **Primary** (`#FFFFFF`): Crisp white used for main backgrounds to maintain a clinical, clean feel.
- **Secondary / Accent** (`#DCA51B`): A luxurious gold used for highlights, buttons, borders, and active states.
- **Tertiary** (`#111111`): Deep off-black used for primary text and headings for maximum contrast.
- **Neutral** (`#787776`): Soft gray for secondary text, descriptions, and subtle borders.
- **Off-White** (`#FCF9F7`): Used for alternate section backgrounds to break up content without losing the clean aesthetic.

## 3. Typography
- **Headings & Titles**: **"Nunito"** 
  - A soft, rounded, and friendly sans-serif font integrated globally for all headers, topic labels, and prominent textual elements. It gives the brand a distinct, premium identity.
- **Global Sizing**: The base typography scale has been increased globally across the application for improved readability and a bold, modern look.

## 4. UI Components & Shapes
- **Corner Radii**: A defining characteristic of the UI is the use of smooth, large rounded corners. All cards, images, and major containers use `rounded-3xl` (24px) for a soft, approachable feel.
- **Depth**: Soft shadows (`shadow-sm`, `shadow-md`) and backdrop blurs (`backdrop-blur-xl`) are used sparingly on sticky headers and floating elements to create spatial depth without clutter.

## 5. Animations & Interactions
The site feels "alive" through the strategic use of animations powered by `framer-motion` and `gsap`:
- **Scroll Reveals**: Elements smoothly fade and slide up into place as they enter the viewport.
- **Patient Stories (Testimonials)**: Implemented as a continuous, infinite marquee loop that scrolls horizontally.
- **Journal Insights**: Features an interactive hover-to-reveal effect where hovering over an article seamlessly switches the featured image.
- **Mobile Navigation**: Uses a custom `StaggeredMenu` component that elegantly animates in from the side with staggered lists and a spinning toggle icon, styled natively in the brand's gold and dark palette.

## 6. Layout Architecture
- **Responsive Navigation**: A sticky header that transitions to a frosted glass (`backdrop-blur`) effect upon scrolling. 
- **Grids & Spacing**: Content is constrained by a `max-w-container` utility with consistent mobile (`px-margin-mobile`), tablet, and desktop margins.
- **Branding**: The custom logo with a transparent background (`logo.png`) is integrated across the Header, Footer, and Mobile Drawer.
