## 2025-05-18 - Portfolio Grid Keyboard Accessibility & Video Preview
**Learning:** Interactive band/card sections with hover video previews need `role="button"`, `tabIndex={0}`, `aria-label`, and keyboard event handlers (`Enter`/`Space`) along with `onFocus`/`onBlur` video play triggers so keyboard users receive equal interactive feedback and accessibility as mouse users.
**Action:** When creating custom interactive media cards or bands, ensure keyboard focus states (`:focus-visible`) mirror hover styles and video preview handlers are bound to focus/blur.
