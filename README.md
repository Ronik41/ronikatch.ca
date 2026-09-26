# Roni Katcharovski — Interactive Driveway Portfolio

[**Visit the live portfolio →**](https://ronikatch.ca)

An interactive, framework-free engineering portfolio that turns a driveway into a timeline of co-op experiences. Visitors can open the latest work in one click, follow a guided timeline through all six roles, or jump directly to an employer. A stylized WHOOP band with rounded surfaces and a full 3D rotation joins the skateboard and robot in the driveway, with approach and return animations for each object. On mobile, a six-stop swipeable driveway leads into full-screen experience views with direct role selection and next/back controls.

## Why this project

I wanted the portfolio itself to demonstrate product thinking: establish a memorable metaphor, make the interaction discoverable, and retain a clear, accessible path through the content. The driveway represents a progression through experiences; vehicles correspond to Ford and Tesla chapters, while foreground objects lead to Electrium Mobility and Exceed Robotics.

The experience supports mouse, touch, keyboard navigation, browser history, deep links, and reduced-motion preferences. The interface uses image-backed 2.5D scenes with perspective-mapped controls rather than a full 3D engine, keeping it fast to load and easy to maintain.

## Demo

[Watch the 39-second portfolio walkthrough](assets/demo/roni-driveway-demo-v3.mp4). It shows the Cybercab chapter, returns to the driveway before each new interaction, and covers Ford, WHOOP, Electrium, Exceed, and About.

## Highlights

- **Guided journey:** each stop opens its work immediately, with previous/next controls and a persistent timeline. Clicking a vehicle enters its cabin without opening the reading view. Cabin screens show a concise role preview; clicking the screen opens the full work. Vehicle changes animate back through the driveway and into the selected car, with Skip and reduced-motion support. Cabin exploration is optional. The dashboard uses vehicle illustrations and a destination list; personal photos and games are not shown in the work views. Electrium and Exceed retain their project photos.
- **Mobile journey:** choose a vehicle in the driveway, open its work full-screen, and move through every role with persistent navigation.
- **Accessible by design:** keyboard-operable controls, focus management, Escape/back navigation, semantic labels, and reduced-motion support.
- **Performance-conscious assets:** optimized, stylized scene art is loaded on demand; cabin scenes load when their experience is opened.
- **No framework required:** native ES modules, HTML, and CSS keep the production site small and inspectable.
- **Tested interaction logic:** Node tests cover the scene projection helpers and mini-game rules.

## Experience chapters

| Chapter | Theme |
| --- | --- |
| Ford · 2024 | Software engineering co-op experience |
| Tesla · 2025 | Software engineering co-op experience |
| Tesla / Cybercab · 2026 | Manufacturing software and developer-tooling work |
| WHOOP · 2025 | Manufacturing testers and hardware simulation |
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
├── journey.mjs             # Shared ordering and content for all six roles
├── journey.css             # Guided navigation and mobile reading layouts
├── images/                 # Personal experience photos and portrait
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
