## 2025-02-22 - Prevent Rive Canvas Component Re-renders with React.memo

**Learning:** Heavy WebGL canvas components using `@rive-app/react-webgl2` evaluate numerous custom view model hooks and re-register event listeners on every re-render. When parent components hold unrelated UI state (such as panel open/close toggles), child Rive components re-render needlessly and impact main-thread performance.

**Action:** Wrap Rive canvas components (`RiveWheelContent`) and control panels (`LogicPanel`) in `React.memo` so they only re-render when their actual configuration props change.
