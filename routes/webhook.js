const express = require('express');
const router = express.Router();

// @route   POST /api/webhooks/mt5
// @desc    Empfange Webhook-Benachrichtigungen von der MT5-API
// @access  Public (wird von der MT5-API aufgerufen)
router.post('/mt5', async (req, res) => {
  try {
    const data = req.body;
    console.log('Webhook von MT5-API empfangen:', data);
    
    // Hier würde die Logik stehen, um die Benachrichtigung zu verarbeiten
    // und z. B. die Datenbank zu aktualisieren oder einen Push-Notification zu senden.

    res.status(200).send('Webhook erfolgreich empfangen.');
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server-Fehler');
  }
});

module.exports = router;
