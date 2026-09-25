# Roni Katcharovski — Interactive Driveway Portfolio

[**Visit the live portfolio →**](https://ronikatch.ca)

An interactive, framework-free engineering portfolio that turns a driveway into a timeline of co-op experiences. Visitors enter a vehicle or interact with an object to explore the work behind each chapter instead of reading a conventional project list.

## Why this project

I wanted the portfolio itself to demonstrate product thinking: establish a memorable metaphor, make the interaction discoverable, and retain a clear, accessible path through the content. The driveway represents a progression through experiences; vehicles correspond to Ford and Tesla chapters, while foreground objects lead to Electrium Mobility and Exceed Robotics.

The experience supports mouse, touch, keyboard navigation, browser history, deep links, and reduced-motion preferences. The interface uses image-backed 2.5D scenes with perspective-mapped controls rather than a full 3D engine, keeping it fast to load and easy to maintain.

## Demo

[Watch the 39-second portfolio walkthrough](assets/demo/roni-driveway-demo-v3.mp4). It shows the Cybercab chapter, returns to the driveway before each new interaction, and covers Ford, WHOOP, Electrium, Exceed, and About.

## Highlights

- **Interactive journey:** vehicle hotspots, cabin transitions, and focused experience views replace a static résumé page.
- **Accessible by design:** keyboard-operable controls, focus management, Escape/back navigation, semantic labels, and reduced-motion support.
- **Performance-conscious assets:** optimized, stylized scene art is loaded on demand; only the first cabin is preloaded after the landing scene.
- **No framework required:** native ES modules, HTML, and CSS keep the production site small and inspectable.
- **Tested interaction logic:** Node tests cover the scene projection helpers and mini-game rules.

## Experience chapters

| Chapter | Theme |
| --- | --- |
| Ford · 2024 | Software engineering co-op experience |
| Tesla · 2025 | Software engineering co-op experience |
| Tesla / Cybercab · 2026 | Manufacturing software and developer-tooling work |
| Electrium Mobility | Electric-mobility work |
| Exceed Robotics | Robotics work |

## Run locally

```bash
npm test
npm run build
npm run preview
```

Open [http://127.0.0.1:5173](http://127.0.0.1:5173). `npm run build` produces the deployable static site in `dist/`.

## Project structure

```text
├── index.html              # Landing scene and accessible application structure
├── driveway.css            # Responsive driveway, cabin, and interaction styling
├── driveway.js             # Navigation, transitions, dialogs, and focus handling
├── experience.mjs          # Experience content and chapter metadata
├── mini-games.mjs          # Small interactive experiences
├── scene-geometry.mjs      # Screen and wearable interaction geometry
├── assets/                 # Optimized scene art, props, and résumé
└── scripts/                # Static build and Node test utilities
```

## Deployment

The portfolio is deployed as a static Vercel site and served at [ronikatch.ca](https://ronikatch.ca).

## Contact

- [Portfolio](https://ronikatch.ca)
- [LinkedIn](https://www.linkedin.com/in/roni-katcharovski/)
- [Email](mailto:rkatchar@uwaterloo.ca)
