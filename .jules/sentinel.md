## 2025-05-18 - Path Traversal Flaw in Asset Sanitization Regex
**Vulnerability:** `sanitizeAssetName` used `replace(/^(\.\.[\/\\])+/g, "")` which failed to strip `..` sequences without trailing slashes (such as `..` or `../..`) and did not decode URL-encoded traversal payloads (`%2e%2e`), allowing directory traversal when fetching assets.
**Learning:** Incomplete regex sanitization on user-supplied or asset-provided names can leave traversal vectors intact if boundary characters like trailing slashes or URL encodings are omitted.
**Prevention:** Always URL-decode asset inputs before sanitization and strip leading dot sequences (`^\.+`) and path separators completely.
