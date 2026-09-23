# The Driveway

A framework-free, image-backed interactive portfolio. The graphic blue-hour scenes use generated low-poly artwork, live vehicle hover regions, and perspective-mapped HTML screen controls. It is a 2.5D experience rather than a freely navigable 3D world.

## Run and build

- `npm run preview`: serve the project at http://127.0.0.1:5173
- `npm test`: check screen projection across viewport sizes
- `npm run build`: assemble public assets into `dist`

The existing `npm run dev` / Vercel configuration and `api/` remain available for the prior site. The Sites preview is a static deployment and does not host that Vercel API.

## Interaction

Hover or keyboard-focus a vehicle to highlight its silhouette. Clicking enters its cabin; the screen stays off. Clicking the display zooms it into a reading view. Back to cabin or Escape turns it off again. Click the wristband for WHOOP. Browser history and #ford, #cybertruck, #cybercab, #whoop links are supported. Motion follows the device's reduced-motion preference.

On small screens the complete scene fits the viewport, with text chapter controls for touch access. The screen opens at nearly full viewport size.

## Content and assets

The co-op content is drawn from the existing portfolio. The 2026 chapter is explicitly marked as awaiting details. Employer names describe experience, not sponsorship. No standalone employer logo assets are used in the new interface; the generated Nautilus drawing includes a small incidental grille emblem. This is not trademark clearance.

- `driveway.js`: co-op content and interaction states
- `driveway.css`: scene, phone, and focused screen styles
- `scene-geometry.mjs`: per-scene screen and wrist coordinates
- `assets/scenes/*-stylized.webp`: optimized artwork generated with built-in ImageGen
- `assets/scenes/graphic-prompts.txt`: generation prompts
- `corkboard.html`: preserved previous homepage

All four scene images total approximately 284 KB. The first cabin is preloaded only after the initial page has loaded. Other cabin images load on demand.
