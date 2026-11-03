# Bolt's Performance Journal

## 2025-05-18 - Route-level code splitting for WebGL / Rive runtime
**Learning:** Rive (@rive-app/react-webgl2) and its associated canvas/asset dependencies account for >55% of the production bundle (~357 kB minified). Statically importing Rive-heavy routes like WheelspinEngine in `App.tsx` forces all root visitors to load this runtime upfront even when browsing only the portfolio grid.
**Action:** When adding rich canvas/interactive case study routes, use `React.lazy()` and `<Suspense>` to keep the entry chunk small (<300 kB) and prevent blocking initial page renders with unneeded graphics engines.
