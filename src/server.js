const app = require("./app");
const config = require("./config");
const runMigrations = require("./database/migrate");

runMigrations();

app.listen(config.port, () => {
  console.log(`Server running at ${config.baseUrl}`);
  console.log(`Swagger docs at ${config.baseUrl}/api-docs`);
});
