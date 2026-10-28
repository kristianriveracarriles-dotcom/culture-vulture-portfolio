# Bolt's Journal

## 2025-10-28 - Route-Level Code Splitting for Heavy WebGL/WASM Bundles
**Learning:** Route components that pull in heavy third-party WebAssembly/WebGL runtimes (like `@rive-app/react-webgl2`) significantly increase initial JS entry bundle size (~640 kB). Lazy-loading the route component via `React.lazy` and `Suspense` isolates the heavy dependency into its own dynamic chunk, reducing main entry bundle size by over 50%.
**Action:** Always inspect bundle composition with `pnpm build` when routes import heavy animation or 3D/WASM engines, and apply `React.lazy()` for route-level code splitting.
