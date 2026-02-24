const db = require("./connection");

function runMigrations() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS urls (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      original_url TEXT    NOT NULL,
      short_code  TEXT    NOT NULL UNIQUE,
      clicks      INTEGER DEFAULT 0,
      created_at  TEXT    DEFAULT (datetime('now'))
    )
  `);

  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_short_code ON urls(short_code)
  `);
}

module.exports = runMigrations;
