# The Driveway

A framework-free, image-backed interactive portfolio. The graphic blue-hour scenes use generated low-poly artwork, live vehicle hover regions, and perspective-mapped HTML screen controls. It is a 2.5D experience rather than a freely navigable 3D world.

## Run and build

- `npm run preview`: serve the project at http://127.0.0.1:5173
- `npm test`: check screen projection and mini-game rules
- `npm run build`: assemble the deployable static site in `dist`

The portfolio is a static Vercel deployment; it has no runtime API or client-side secrets.

## Interaction

Hover or keyboard-focus a vehicle to highlight its silhouette. Clicking enters its cabin; the screen stays off. Clicking the display zooms it into a reading view. Back to cabin or Escape turns it off again. Click the wristband for WHOOP. A small electric skateboard and tracked rover in the foreground open Electrium Mobility and Exceed Robotics, respectively. All experience lists all six roles newest first; Projects is hidden from the active portfolio. Browser history and #ford, #cybertruck, #cybercab, #whoop links are supported. Motion follows the device's reduced-motion preference.

On small screens the complete scene fits the viewport, with text chapter controls for touch access. The screen opens at nearly full viewport size. Persistent ambient glows identify the screen and wristband; hover and keyboard focus strengthen them.

Each infotainment launches Overview, Contact, and a unique mini-game without tabs or skill lists. The Lincoln uses a CarPlay-inspired layout; Tesla cabins use a light Tesla-inspired interface. WHOOP is accessed from the wristband, not from an infotainment app. Photos retain their complete framing and can be enlarged.

## Content and assets

The co-op content is drawn from the uploaded 2027 software résumé, including Tesla manufacturing software work from May–August 2026. Employer names describe experience, not sponsorship. No standalone employer logo assets are used in the new interface; the generated Nautilus drawing includes a small incidental grille emblem. This is not trademark clearance.

- `driveway.js`: interaction states and app launchers
- `experience.mjs`: résumé-backed co-op content
- `mini-games.mjs`: Memory Lane, Charge Shift, and Route Finder
- `driveway.css`: scene, phone, and focused screen styles
- `scene-geometry.mjs`: per-scene screen and wrist coordinates
- `assets/scenes/*-stylized.webp`: optimized artwork generated with built-in ImageGen
- `assets/scenes/graphic-prompts.txt`: generation prompts

All four scene images total approximately 284 KB. The first cabin is preloaded only after the initial page has loaded. Other cabin images load on demand.
