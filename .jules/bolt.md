# Bolt's Performance Journal

## 2026-10-31 - Route Code Splitting for Heavy WebGL/Rive Dependencies
**Learning:** Heavy dynamic canvas/WebGL runtime dependencies like `@rive-app/react-webgl2` in `WheelspinEngine` significantly bloat the initial bundle (over 55% of the total bundle size, 640.32 kB down to 282.12 kB; gzipped 183.10 kB down to 92.15 kB) when imported statically in `App.tsx`.
**Action:** Always lazy-load heavy interactive engine routes (e.g., Rive/Canvas components) using `React.lazy()` and `React.Suspense` to keep initial route bundle payloads lightweight.
