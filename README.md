# URL Shortener API

A simple and fast URL shortener REST API built with **Express** and **SQLite**.

## Features

- Shorten long URLs into compact short codes
- Redirect to original URLs via short codes
- Click tracking and statistics
- URL validation (only `http` / `https`)
- Swagger API documentation
- Rate limiting, CORS, and Helmet security headers

## Tech Stack

| Layer       | Technology     |
| ----------- | -------------- |
| Runtime     | Node.js        |
| Framework   | Express        |
| Database    | SQLite (better-sqlite3) |
| ID Gen      | nanoid         |
| Docs        | swagger-jsdoc + swagger-ui-express |
| Security    | helmet, cors, express-rate-limit |

## Getting Started

### Prerequisites

- Node.js >= 18

### Installation

```bash
git clone <repo-url>
cd url-shortener
npm install
cp .env.example .env   # edit BASE_URL for production
```

### Run

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

The server starts at `http://localhost:3000` by default.

## API Endpoints

| Method | Path                  | Description                    |
| ------ | --------------------- | ------------------------------ |
| POST   | `/shorten`            | Shorten a URL                  |
| GET    | `/:shortCode`         | Redirect to original URL       |
| GET    | `/:shortCode/stats`   | Get click stats for a URL      |
| GET    | `/health`             | Health check                   |
| GET    | `/api-docs`           | Swagger UI documentation       |

### Example

```bash
# Shorten a URL
curl -X POST http://localhost:3000/shorten \
  -H "Content-Type: application/json" \
  -d '{"url": "https://www.example.com/very/long/path"}'

# Response
{
  "success": true,
  "data": {
    "originalUrl": "https://www.example.com/very/long/path",
    "shortUrl": "http://localhost:3000/Ab3xK9z",
    "shortCode": "Ab3xK9z"
  }
}
```

## Environment Variables

| Variable   | Default                  | Description              |
| ---------- | ------------------------ | ------------------------ |
| `PORT`     | `3000`                   | Server port              |
| `BASE_URL` | `http://localhost:3000`  | Public base URL          |
| `NODE_ENV` | `development`            | Environment mode         |

## Deploy to Render

1. Push this repo to GitHub
2. Connect the repo on [Render](https://render.com)
3. Render will auto-detect `render.yaml`
4. Set the `BASE_URL` environment variable to your Render URL (e.g. `https://url-shortener-xxxx.onrender.com`)

## License

MIT
