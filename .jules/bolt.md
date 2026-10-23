## 2025-02-18 - Heavy WebGL animation dependencies should be route-code-split

**Learning:** `@rive-app/react-webgl2` and its WebGL animation assets pull in ~300KB of minified JS (~500KB total bundle overhead). Statically importing Rive case-study components in `App.tsx` balloons the initial bundle size for all users, including those only viewing the home portfolio grid.
**Action:** Always lazy-load Rive case-study route components (`React.lazy` + `Suspense`) to keep the initial page bundle minimal (~92KB gzipped) and load heavy WebGL runtimes on demand.
