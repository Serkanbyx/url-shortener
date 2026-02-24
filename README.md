# ⚡ URL Shortener API

A modern, fast, and secure URL shortener REST API built with Express.js and SQLite. Shorten long URLs into compact short codes, redirect seamlessly, and track click statistics — all through a clean RESTful interface with Swagger documentation.

[![Created by Serkanby](https://img.shields.io/badge/Created%20by-Serkanby-blue?style=flat-square)](https://serkanbayraktar.com/)
[![GitHub](https://img.shields.io/badge/GitHub-Serkanbyx-181717?style=flat-square&logo=github)](https://github.com/Serkanbyx)

## Features

- **URL Shortening**: Convert long URLs into compact 7-character short codes using nanoid
- **Smart Redirect**: Automatically redirect users to original URLs via short codes (302)
- **Click Tracking**: Track click counts and creation dates for every shortened URL
- **Duplicate Detection**: Returns existing short code if the same URL is shortened again
- **URL Validation**: Only accepts valid `http` and `https` URLs
- **Swagger Documentation**: Interactive API documentation with Swagger UI
- **Security Headers**: Helmet integration for HTTP header protection
- **Rate Limiting**: DDoS and abuse protection (100 requests per 15 minutes)
- **CORS Support**: Cross-Origin Resource Sharing enabled for API consumers
- **Health Check**: Built-in health check endpoint for monitoring

## Live Demo

[🔗 View Live Demo](https://url-shortener-xzz2.onrender.com/)

API Documentation: [📖 Swagger UI](https://url-shortener-xzz2.onrender.com/api-docs)

## Technologies

- **Node.js (>= 18)**: JavaScript runtime environment
- **Express.js 5**: Fast, minimal web framework
- **SQLite (better-sqlite3)**: Lightweight, zero-config embedded database
- **nanoid**: Secure, URL-friendly unique ID generator
- **Swagger (swagger-jsdoc + swagger-ui-express)**: Interactive API documentation
- **Helmet**: HTTP security headers middleware
- **CORS**: Cross-Origin Resource Sharing middleware
- **express-rate-limit**: Rate limiting middleware for DDoS protection
- **dotenv**: Environment variable management
- **nodemon**: Development auto-reload tool

## Installation

### Prerequisites

- Node.js >= 18

### Local Development

1. Clone the repository:

```bash
git clone https://github.com/Serkanbyx/url-shortener.git
cd url-shortener
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.example .env
```

4. Edit `.env` file according to your needs:

```env
PORT=3000
BASE_URL=http://localhost:3000
NODE_ENV=development
```

5. Start the development server:

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

The server starts at `http://localhost:3000` by default.

## Usage

1. Open the Swagger documentation at `http://localhost:3000/api-docs` for an interactive API explorer
2. Send a `POST` request to `/shorten` with a JSON body containing the URL you want to shorten
3. Use the returned short URL to redirect to the original URL
4. Check click statistics by appending `/stats` to the short code endpoint

## API Endpoints

| Method | Path | Description |
| ------ | -------------------- | ------------------------------ |
| POST | `/shorten` | Shorten a URL |
| GET | `/:shortCode` | Redirect to original URL |
| GET | `/:shortCode/stats` | Get click stats for a URL |
| GET | `/health` | Health check |
| GET | `/api-docs` | Swagger UI documentation |

### Shorten a URL

```bash
curl -X POST https://url-shortener-xzz2.onrender.com/shorten \
  -H "Content-Type: application/json" \
  -d '{"url": "https://www.example.com/very/long/path"}'
```

**Response (201 Created):**

```json
{
  "success": true,
  "data": {
    "originalUrl": "https://www.example.com/very/long/path",
    "shortUrl": "https://url-shortener-xzz2.onrender.com/Ab3xK9z",
    "shortCode": "Ab3xK9z"
  }
}
```

### Redirect

```bash
curl -L https://url-shortener-xzz2.onrender.com/Ab3xK9z
```

### Get Statistics

```bash
curl https://url-shortener-xzz2.onrender.com/Ab3xK9z/stats
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "originalUrl": "https://www.example.com/very/long/path",
    "shortCode": "Ab3xK9z",
    "clicks": 42,
    "createdAt": "2026-02-24 12:00:00"
  }
}
```

## How It Works?

### URL Shortening Flow

1. User submits a long URL via `POST /shorten`
2. The URL is validated to ensure it uses `http` or `https` protocol
3. The database is checked for an existing entry with the same URL
4. If found, the existing short code is returned (no duplicates)
5. If not found, a new 7-character short code is generated using nanoid
6. The entry is saved to the SQLite database and the short URL is returned

### Short Code Generation

```javascript
const { nanoid } = require("nanoid");
const code = nanoid(7); // e.g., "Ab3xK9z"
```

- Uses a URL-safe alphabet: `A-Za-z0-9_-` (64 characters)
- 7-character codes provide **~4.4 billion** unique combinations
- Collision detection ensures uniqueness in the database

### Database Schema

```sql
CREATE TABLE urls (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  original_url TEXT    NOT NULL,
  short_code   TEXT    NOT NULL UNIQUE,
  clicks       INTEGER DEFAULT 0,
  created_at   TEXT    DEFAULT (datetime('now'))
);

CREATE INDEX idx_short_code ON urls(short_code);
```

### Security Measures

- **Helmet**: Sets secure HTTP headers (X-Content-Type-Options, X-Frame-Options, etc.)
- **Rate Limiting**: 100 requests per 15-minute window per IP
- **CORS**: Configurable cross-origin policy
- **Input Validation**: Only `http`/`https` URLs are accepted
- **Prepared Statements**: SQL injection protection via better-sqlite3

## Environment Variables

| Variable | Default | Description |
| ---------- | ----------------------- | ---------------------- |
| `PORT` | `3000` | Server port |
| `BASE_URL` | `http://localhost:3000` | Public base URL |
| `NODE_ENV` | `development` | Environment mode |

## Deploy to Render

1. Push this repo to GitHub
2. Connect the repo on [Render](https://render.com)
3. Render will auto-detect `render.yaml` configuration
4. Set the `BASE_URL` environment variable to your Render URL (e.g., `https://url-shortener-xzz2.onrender.com`)
5. Deploy and enjoy your live URL shortener

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feat/amazing-feature`)
3. Commit your changes using conventional commits:
   - `feat:` — New feature
   - `fix:` — Bug fix
   - `refactor:` — Code refactoring
   - `docs:` — Documentation changes
   - `chore:` — Maintenance tasks
4. Push to the branch (`git push origin feat/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

## Developer

**Serkan Bayraktar**

- [Website](https://serkanbayraktar.com/)
- [GitHub](https://github.com/Serkanbyx)
- [Email](mailto:serkanbyx1@gmail.com)

## Contact

- For bug reports and feature requests, please [open an issue](https://github.com/Serkanbyx/url-shortener/issues)
- Email: [serkanbyx1@gmail.com](mailto:serkanbyx1@gmail.com)
- Website: [serkanbayraktar.com](https://serkanbayraktar.com/)

---

⭐ If you like this project, don't forget to give it a star!
