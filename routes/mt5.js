const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Mt5Account = require('../models/Mt5Account');

// @route   POST /api/mt5/account
// @desc    Speichere oder aktualisiere die MT5-Anmeldedaten für den Benutzer
// @access  Private
router.post('/account', auth, async (req, res) => {
  try {
    const { login, password, server } = req.body;

    // Suche nach existierenden MT5-Einstellungen für den Benutzer
    let mt5Account = await Mt5Account.findOne({ user: req.user.id });

    if (mt5Account) {
      // Wenn das Konto existiert, aktualisiere es
      mt5Account = await Mt5Account.findOneAndUpdate(
        { user: req.user.id },
        { $set: { login, password, server } },
        { new: true }
      );
    } else {
      // Wenn kein Konto existiert, erstelle ein neues
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

module.exports = router;
