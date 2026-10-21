# Palette's UX Journal

## 2025-05-20 - Portfolio Grid Interactive Cards Keyboard Access
**Learning:** In portfolio/card grid layouts where `<section>` elements with `onClick` handlers act as primary navigation triggers, non-pointer (keyboard-only and screen reader) users cannot focus or activate the cards unless `tabIndex`, `role="button"`, `aria-label`, and `onKeyDown` handlers are provided.
**Action:** Always ensure interactive container elements (`<section>`, `<div>`) used as clickable cards have `tabIndex={0}`, `role="button"`, appropriate `aria-label`, and `onKeyDown` supporting Enter and Space key activation.
