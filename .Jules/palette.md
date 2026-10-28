# Palette's Journal - UX & Accessibility Learnings

## 2025-10-28 - Video Preview and Focus Parity for Interactive Cards
**Learning:** Interactive portfolio cards (`<section>`/`<div>`) with video hover effects often exclude keyboard users. Adding `tabIndex={0}`, `role="button"`, and pairing `onFocus`/`onBlur` with `onMouseEnter`/`onMouseLeave` enables video preview playback for keyboard users. CSS `:focus-visible` must mirror `:hover` glitch and aura effects for full visual parity.
**Action:** Always include focus event listeners and `:focus-visible` styling alongside hover effects on custom interactive media cards.
