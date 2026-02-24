require("dotenv").config();

const config = {
  port: parseInt(process.env.PORT, 10) || 3000,
  baseUrl: process.env.BASE_URL || "http://localhost:3000",
  nodeEnv: process.env.NODE_ENV || "development",
  db: {
    path: process.env.DB_PATH || "./data/urls.db",
  },
  shortCode: {
    length: 7,
  },
  rateLimit: {
    windowMs: 15 * 60 * 1000,
    max: 100,
  },
};

module.exports = config;
