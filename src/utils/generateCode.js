const { nanoid } = require("nanoid");
const config = require("../config");

/**
 * Generates a URL-safe short code using nanoid.
 * Default alphabet: A-Za-z0-9_-  (64 chars)
 */
function generateCode() {
  return nanoid(config.shortCode.length);
}

module.exports = generateCode;
