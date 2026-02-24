const db = require("../database/connection");

const urlModel = {
  create(originalUrl, shortCode) {
    const stmt = db.prepare(
      "INSERT INTO urls (original_url, short_code) VALUES (?, ?)"
    );
    return stmt.run(originalUrl, shortCode);
  },

  findByShortCode(shortCode) {
    const stmt = db.prepare("SELECT * FROM urls WHERE short_code = ?");
    return stmt.get(shortCode);
  },

  findByOriginalUrl(originalUrl) {
    const stmt = db.prepare("SELECT * FROM urls WHERE original_url = ?");
    return stmt.get(originalUrl);
  },

  incrementClicks(shortCode) {
    const stmt = db.prepare(
      "UPDATE urls SET clicks = clicks + 1 WHERE short_code = ?"
    );
    return stmt.run(shortCode);
  },

  getStats(shortCode) {
    const stmt = db.prepare(
      "SELECT short_code, original_url, clicks, created_at FROM urls WHERE short_code = ?"
    );
    return stmt.get(shortCode);
  },
};

module.exports = urlModel;
