## 2025-10-25 - Code Splitting Heavy WASM/WebGL Rive Routes
**Learning:** Heavy WebGL/WASM animation packages like `@rive-app/react-webgl2` significantly inflate initial bundle sizes (~300kB+) when imported synchronously on root routes.
**Action:** Always code-split heavy project routes using `React.lazy()` and `Suspense` so landing page loads remain fast and lightweight.
