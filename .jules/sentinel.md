# Sentinel Security Journal

## 2025-02-18 - Rive Asset Loader Path Traversal Prevention
**Vulnerability:** `sanitizeAssetName` in Rive asset loader allowed path traversal via standalone `..`, URL-encoded sequences (`%2e%2e`), or middle-path traversal (`foo/../bar`), potentially allowing fetch requests outside `/assets/rive/`.
**Learning:** Naive regex replaces like `/^(\.\.[\/\\])+/g` fail when `..` is not followed by slashes or when URI-encoded sequences or internal traversals are used.
**Prevention:** Always URI-decode input before sanitization, strip control/null characters, strip all path delimiters (`/`, `\`), and strip any remaining consecutive dot sequences (`..+`).
