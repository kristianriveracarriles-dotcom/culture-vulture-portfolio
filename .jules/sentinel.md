## 2025-05-18 - Path Traversal Bypass in Asset Sanitization
**Vulnerability:** Simple single-pass regex replacement `replace(/^(\.\.[\/\\])+/g, "")` allowed path traversal bypasses using standalone `..`, nested traversal sequences (`....//`), or URL-encoded paths (`%2e%2e%2f`).
**Learning:** Single-pass regex stripping of path traversal characters can leave remaining `..` or path separators intact or be bypassed by URL encoding.
**Prevention:** URL-decode asset inputs safely first, remove slashes and URL control characters, and iteratively strip `..` sequences until none remain.
