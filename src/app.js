const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");
const urlRoutes = require("./routes/urlRoutes");
const errorHandler = require("./middleware/errorHandler");
const config = require("./config");

const app = express();

// --- Security ---
app.use(helmet());
app.use(cors());

// --- Rate Limiting ---
const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: "Too many requests, please try again later.",
  },
});
app.use(limiter);

// --- Body Parsing ---
app.use(express.json());

// --- Swagger Docs ---
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// --- Health Check ---
app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

// --- Routes ---
app.use("/", urlRoutes);

// --- Error Handling ---
app.use(errorHandler);

module.exports = app;
