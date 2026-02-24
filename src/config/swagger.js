const swaggerJsdoc = require("swagger-jsdoc");
const config = require("./index");

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "URL Shortener API",
    version: "1.0.0",
    description:
      "A simple and fast URL shortener REST API. Shorten long URLs, redirect via short codes, and track click statistics.",
  },
  servers: [
    {
      url: config.baseUrl,
      description:
        config.nodeEnv === "production" ? "Production server" : "Development server",
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ["./src/routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
