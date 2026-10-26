## 2026-10-25 - Prevent Rive WebGL Hook Re-evaluation via React.memo
**Learning:** Components containing `@rive-app/react-webgl2` hooks (`useRive`, `useViewModelInstance*`) trigger WebGL state evaluations and WASM view model binding lookups on every component render. If parent state (e.g., UI side panel visibility) updates, unmemoized Rive components re-evaluate all 15+ hooks needlessly.
**Action:** Always wrap Rive WebGL canvas components with `React.memo()` and ensure configuration objects passed to Rive components maintain reference stability or memoized props.
