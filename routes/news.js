const express = require('express');
const router = express.Router();
const axios = require('axios');
const auth = require('../middleware/auth');

// @route   GET /api/news
// @desc    Ruft Finanznachrichten von einer externen API ab
// @access  Private
router.get('/', auth, async (req, res) => {
  const apiKey = process.env.NEWS_API_KEY; // Den API-Schlüssel aus den Render-Umgebungsvariablen holen
  const newsApiUrl = 'https://newsapi.org/v2/top-headlines?country=us&category=business'; // Beispiel-URL

  try {
    const response = await axios.get(newsApiUrl, {
      params: {
        apiKey: apiKey,
      },
    });
    res.json(response.data);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server-Fehler beim Abrufen der Nachrichten');
  }
});

module.exports = router;
