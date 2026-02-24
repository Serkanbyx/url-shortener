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

// --- Welcome Page ---
app.get("/", (_req, res) => {
  const pkg = require("../package.json");
  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${pkg.name}</title>
  <style>
    *,*::before,*::after{margin:0;padding:0;box-sizing:border-box}

    body{
      min-height:100vh;
      display:flex;
      align-items:center;
      justify-content:center;
      font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;
      background:#0a0e1a;
      color:#e2e8f0;
      overflow:hidden;
      position:relative;
    }

    body::before{
      content:"";
      position:fixed;
      inset:0;
      background:
        radial-gradient(ellipse 600px 400px at 20% 30%,rgba(99,102,241,.12),transparent),
        radial-gradient(ellipse 500px 500px at 80% 70%,rgba(6,182,212,.10),transparent),
        radial-gradient(ellipse 300px 300px at 50% 50%,rgba(139,92,246,.08),transparent);
      pointer-events:none;
      z-index:0;
    }

    body::after{
      content:"";
      position:fixed;
      inset:0;
      background:
        repeating-linear-gradient(90deg,transparent,transparent 59px,rgba(99,102,241,.03) 59px,rgba(99,102,241,.03) 60px),
        repeating-linear-gradient(0deg,transparent,transparent 59px,rgba(99,102,241,.03) 59px,rgba(99,102,241,.03) 60px);
      pointer-events:none;
      z-index:0;
    }

    .container{
      position:relative;
      z-index:1;
      text-align:center;
      padding:3rem 2rem;
      max-width:520px;
      width:100%;
    }

    .chain{
      display:flex;
      align-items:center;
      justify-content:center;
      gap:.6rem;
      margin-bottom:2rem;
    }

    .chain-link{
      width:38px;height:22px;
      border:3px solid rgba(99,102,241,.5);
      border-radius:11px;
      position:relative;
    }
    .chain-link:nth-child(2){border-color:rgba(6,182,212,.6);transform:translateX(-6px)}
    .chain-link:nth-child(3){border-color:rgba(139,92,246,.5);transform:translateX(-12px)}

    .arrow{
      font-size:1.4rem;
      color:#06b6d4;
      animation:pulse 2s ease-in-out infinite;
      margin-left:-6px;
    }
    @keyframes pulse{0%,100%{opacity:.4;transform:translateX(0)}50%{opacity:1;transform:translateX(4px)}}

    h1{
      font-size:2.4rem;
      font-weight:800;
      letter-spacing:-.02em;
      background:linear-gradient(135deg,#818cf8 0%,#06b6d4 50%,#a78bfa 100%);
      background-clip:text;
      -webkit-background-clip:text;
      -webkit-text-fill-color:transparent;
      margin-bottom:.5rem;
    }

    .version{
      display:inline-block;
      font-size:.8rem;
      font-weight:600;
      color:#06b6d4;
      border:1px solid rgba(6,182,212,.3);
      border-radius:9999px;
      padding:.15rem .75rem;
      margin-bottom:2.5rem;
      letter-spacing:.04em;
    }

    .links{
      display:flex;
      flex-direction:column;
      gap:.75rem;
      margin-bottom:3rem;
    }

    .btn-primary,.btn-secondary{
      display:block;
      padding:.85rem 1.5rem;
      border-radius:12px;
      text-decoration:none;
      font-weight:600;
      font-size:.95rem;
      transition:all .25s ease;
      letter-spacing:.01em;
    }

    .btn-primary{
      background:linear-gradient(135deg,#6366f1,#06b6d4);
      color:#fff;
      box-shadow:0 4px 20px rgba(99,102,241,.3);
    }
    .btn-primary:hover{
      transform:translateY(-2px);
      box-shadow:0 8px 30px rgba(99,102,241,.45);
    }

    .btn-secondary{
      background:rgba(99,102,241,.08);
      color:#a5b4fc;
      border:1px solid rgba(99,102,241,.2);
    }
    .btn-secondary:hover{
      background:rgba(99,102,241,.15);
      border-color:rgba(99,102,241,.4);
      transform:translateY(-2px);
    }

    .sign{
      font-size:.82rem;
      color:#64748b;
      margin-top:1rem;
    }
    .sign a{
      color:#818cf8;
      text-decoration:none;
      font-weight:500;
      transition:color .2s;
    }
    .sign a:hover{color:#06b6d4}

    @media(max-width:480px){
      h1{font-size:1.8rem}
      .container{padding:2rem 1.2rem}
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="chain">
      <div class="chain-link"></div>
      <div class="chain-link"></div>
      <div class="chain-link"></div>
      <span class="arrow">→</span>
    </div>
    <h1>URL Shortener</h1>
    <p class="version">v${pkg.version}</p>
    <div class="links">
      <a href="/api-docs" class="btn-primary">API Documentation</a>
      <a href="/health" class="btn-secondary">Health Check</a>
    </div>
    <footer class="sign">
      Created by
      <a href="https://serkanbayraktar.com/" target="_blank" rel="noopener noreferrer">Serkanby</a>
      |
      <a href="https://github.com/Serkanbyx" target="_blank" rel="noopener noreferrer">Github</a>
    </footer>
  </div>
</body>
</html>`);
});

// --- Routes ---
app.use("/", urlRoutes);

// --- Error Handling ---
app.use(errorHandler);

module.exports = app;
