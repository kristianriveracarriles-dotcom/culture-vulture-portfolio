## 2026-10-22 - Path Traversal Prevention in Rive Asset Loader
**Vulnerability:** Asset names in Rive runtime assets could contain URL-encoded (`%2e%2e`) or nested directory traversal sequences that were not fully stripped by simple regex matching.
**Learning:** Initial sanitization using simple regex (`replace(/^(\.\.[\/\\])+/g, "")`) fails when input contains standalone `..`, nested traversal (`....//`), or URL-encoded sequences (`%2e%2e`).
**Prevention:** Always decode URI components before sanitizing filenames and strip all directory separators (`/`, `\`), `..` sequences, and leading dots.
