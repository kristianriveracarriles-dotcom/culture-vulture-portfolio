# Bolt's Performance Journal

## 2025-05-18 - Route Code Splitting for Heavy WebGL/Rive Dependencies
**Learning:** Heavy dynamic canvas/WebGL runtime dependencies like `@rive-app/react-webgl2` in `WheelspinEngine` significantly bloat the main bundle (over 50% of total bundle size, 640 kB down to 282 kB) if imported statically in `App.tsx`.
**Action:** Always lazy-load heavy interactive engine components (e.g., Rive/Canvas components) behind `React.lazy` and `React.Suspense` routes to keep initial page loads fast.
