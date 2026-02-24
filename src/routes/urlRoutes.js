const express = require("express");
const urlModel = require("../models/urlModel");
const validateUrl = require("../utils/validateUrl");
const generateCode = require("../utils/generateCode");
const config = require("../config");

const router = express.Router();

/**
 * @swagger
 * /shorten:
 *   post:
 *     summary: Shorten a URL
 *     description: Accepts a long URL and returns a shortened version. If the URL was already shortened, returns the existing short URL.
 *     tags: [URL]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - url
 *             properties:
 *               url:
 *                 type: string
 *                 example: https://www.example.com/very/long/path
 *     responses:
 *       201:
 *         description: Short URL created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     originalUrl:
 *                       type: string
 *                     shortUrl:
 *                       type: string
 *                     shortCode:
 *                       type: string
 *       200:
 *         description: URL already shortened — returns existing entry
 *       400:
 *         description: Invalid or missing URL
 */
router.post("/shorten", (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({
      success: false,
      error: "URL is required.",
    });
  }

  if (!validateUrl(url)) {
    return res.status(400).json({
      success: false,
      error: "Invalid URL. Only http and https protocols are allowed.",
    });
  }

  const existing = urlModel.findByOriginalUrl(url);
  if (existing) {
    return res.status(200).json({
      success: true,
      data: {
        originalUrl: existing.original_url,
        shortUrl: `${config.baseUrl}/${existing.short_code}`,
        shortCode: existing.short_code,
      },
    });
  }

  let shortCode = generateCode();

  // Handle extremely rare collision
  while (urlModel.findByShortCode(shortCode)) {
    shortCode = generateCode();
  }

  urlModel.create(url, shortCode);

  return res.status(201).json({
    success: true,
    data: {
      originalUrl: url,
      shortUrl: `${config.baseUrl}/${shortCode}`,
      shortCode,
    },
  });
});

/**
 * @swagger
 * /{shortCode}/stats:
 *   get:
 *     summary: Get URL statistics
 *     description: Returns click count and metadata for a shortened URL.
 *     tags: [URL]
 *     parameters:
 *       - in: path
 *         name: shortCode
 *         required: true
 *         schema:
 *           type: string
 *         description: The short code of the URL
 *     responses:
 *       200:
 *         description: URL statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     shortCode:
 *                       type: string
 *                     originalUrl:
 *                       type: string
 *                     clicks:
 *                       type: integer
 *                     createdAt:
 *                       type: string
 *       404:
 *         description: Short URL not found
 */
router.get("/:shortCode/stats", (req, res) => {
  const { shortCode } = req.params;
  const record = urlModel.getStats(shortCode);

  if (!record) {
    return res.status(404).json({
      success: false,
      error: "Short URL not found.",
    });
  }

  return res.status(200).json({
    success: true,
    data: {
      shortCode: record.short_code,
      originalUrl: record.original_url,
      clicks: record.clicks,
      createdAt: record.created_at,
    },
  });
});

/**
 * @swagger
 * /{shortCode}:
 *   get:
 *     summary: Redirect to original URL
 *     description: Redirects the client to the original long URL and increments the click counter.
 *     tags: [URL]
 *     parameters:
 *       - in: path
 *         name: shortCode
 *         required: true
 *         schema:
 *           type: string
 *         description: The short code of the URL
 *     responses:
 *       302:
 *         description: Redirect to the original URL
 *       404:
 *         description: Short URL not found
 */
router.get("/:shortCode", (req, res) => {
  const { shortCode } = req.params;
  const record = urlModel.findByShortCode(shortCode);

  if (!record) {
    return res.status(404).json({
      success: false,
      error: "Short URL not found.",
    });
  }

  urlModel.incrementClicks(shortCode);
  return res.redirect(302, record.original_url);
});

module.exports = router;
