## 2025-10-21 - Granular Rive View Model Property Syncing
**Learning:** Monolithic `useEffect` dependencies on composite object props (like `config`) when updating Rive WASM view model setters trigger redundant WebGL/bridge operations across unrelated state changes. Splitting into fine-grained `useEffect`s bound to primitives or serialized strings (`config.slices.join("\0")`) prevents unnecessary Rive state machine writes.
**Action:** Always break down Rive or third-party WASM engine property synchronizations into targeted `useEffect` blocks with primitive dependency primitives.
