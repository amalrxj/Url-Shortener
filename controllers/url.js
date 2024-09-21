const shortid = require("shortid");
const URL = require("../models/url");

async function generateShortUrl(req, res) {
  const body = req.body;
  if (!body.url) {
    res.status(400).json({ error: "URL is required" });
  }
  const shortID = shortid(); 
  await URL.create({
    shortId: shortID,
    redirectUrl: body.url,
    visitHistory: [],
  });
  res.json({
    shortId: shortID,
  });
}


async function getAnalytics(req, res) {
  const shortId = req.params.shortId;
  const result = await URL.findOne({ shortId });
  return res.json({
    totalClicks: result.visitHistory.length,
    analytics: result.visitHistory,
  });
}

module.exports = {
  generateShortUrl,
  getAnalytics,
};
