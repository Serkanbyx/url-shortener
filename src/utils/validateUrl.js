/**
 * Validates that a given string is a well-formed HTTP/HTTPS URL.
 * Rejects non-http(s) protocols to prevent javascript: / data: injection.
 */
function validateUrl(urlString) {
  try {
    const url = new URL(urlString);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

module.exports = validateUrl;
