const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Mt5Account = require('../models/Mt5Account');
const { MetaApi } = require('metaapi.cloud-sdk');

// @route   POST /api/mt5/account
// @desc    Speichere oder aktualisiere die MT5-Anmeldedaten für den Benutzer
// @access  Private
router.post('/account', auth, async (req, res) => {
  try {
    const { login, password, server } = req.body;
    let mt5Account = await Mt5Account.findOne({ user: req.user.id });

    if (mt5Account) {
      mt5Account = await Mt5Account.findOneAndUpdate(
        { user: req.user.id },
        { $set: { login, password, server } },
        { new: true }
      );
    } else {
      mt5Account = new Mt5Account({
        user: req.user.id,
        login,
        password,
        server,
      });
      await mt5Account.save();
    }
    
    res.json(mt5Account);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server-Fehler');
  }
});

// @route   GET /api/mt5/account
// @desc    Rufe die gespeicherten MT5-Anmeldedaten des Benutzers ab
// @access  Private
router.get('/account', auth, async (req, res) => {
  try {
    const mt5Account = await Mt5Account.findOne({ user: req.user.id }).select('-password');
    if (!mt5Account) {
      return res.status(404).json({ msg: 'Keine MT5-Kontodaten gefunden' });
    }
    res.json(mt5Account);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server-Fehler');
  }
});

// @route   POST /api/mt5/execute-trade
// @desc    Führt einen Trade über die MetaApi aus
// @access  Private
router.post('/execute-trade', auth, async (req, res) => {
  try {
    const { symbol, action, volume } = req.body;
    const mt5Account = await Mt5Account.findOne({ user: req.user.id });
    if (!mt5Account) {
      return res.status(404).json({ msg: 'Keine MT5-Kontodaten gefunden' });
    }

    // Hier würde die echte MetaApi-Verbindung und Handelslogik stehen.
    // Dies ist ein vereinfachtes Beispiel.
    console.log(`Versuche, einen Trade auszuführen: ${action} ${volume} Lots von ${symbol}`);

    // Simulation einer erfolgreichen Handelsausführung
    res.json({
      msg: 'Handelsbefehl erfolgreich gesendet',
      tradeDetails: { symbol, action, volume, status: 'pending' },
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server-Fehler bei der Handelsausführung');
  }
});

module.exports = router;
