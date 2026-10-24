## 2025-05-20 - Percent-Encoded Path Traversal in Asset Sanitization
**Vulnerability:** `sanitizeAssetName` stripped leading `../` and `/` characters from asset names, but did not perform URI decoding beforehand. This allowed percent-encoded path traversal sequences (e.g. `%2e%2e%2f`) to bypass sanitization. When fetched via `fetch('/assets/rive/' + safeName)`, the browser decoded the percent-encoded sequences, causing requests to escape the asset directory.
**Learning:** Naive regex path sanitization without URI decoding leaves applications vulnerable to URL-encoding sanitization bypasses.
**Prevention:** Always URI-decode string inputs (handling potential nested encoding and URI errors) prior to performing path traversal or filename sanitization.
