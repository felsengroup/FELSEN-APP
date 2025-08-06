const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Mt5Account = require('../models/Mt5Account');
const { MetaApi } = require('metaapi.cloud-sdk');

// Funktion zur Herstellung einer MetaApi-Verbindung
async function connectToMetaApi(userId) {
  const account = await Mt5Account.findOne({ user: userId });
  if (!account) {
    throw new Error('MT5-Anmeldedaten nicht gefunden.');
  }

  const api = new MetaApi();
  const token = process.env.METAAPI_TOKEN; // Holen Sie sich den MetaApi-Token aus den Umgebungsvariablen

  await api.connect(token);
  const accountId = await api.createTradingAccount({
    accountId: account.login,
    password: account.password,
    server: account.server,
  });

  return api.getTradingAccount(accountId);
}

// @route   GET /api/mt5_api/metrics
// @desc    Ruft Kontokennzahlen vom MT5-Konto ab
// @access  Private
router.get('/metrics', auth, async (req, res) => {
  try {
    const tradingAccount = await connectToMetaApi(req.user.id);
    const metrics = await tradingAccount.getMetrics();
    res.json(metrics);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server-Fehler beim Abrufen der Kontokennzahlen');
  }
});

module.exports = router;
