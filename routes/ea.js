const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const EaSettings = require('../models/EaSettings');

// @route   POST /api/ea/settings
// @desc    Speichere oder aktualisiere die EA-Einstellungen für den Benutzer
// @access  Private
router.post('/settings', auth, async (req, res) => {
  try {
    const settings = req.body;

    // Suche nach existierenden Einstellungen für den Benutzer
    let eaSettings = await EaSettings.findOne({ user: req.user.id });

    if (eaSettings) {
      // Wenn Einstellungen existieren, aktualisiere sie
      eaSettings = await EaSettings.findOneAndUpdate(
        { user: req.user.id },
        { $set: settings },
        { new: true }
      );
    } else {
      // Wenn keine Einstellungen existieren, erstelle neue
      eaSettings = new EaSettings({
        user: req.user.id,
        ...settings,
      });
      await eaSettings.save();
    }
    
    res.json(eaSettings);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server-Fehler');
  }
});

// @route   GET /api/ea/settings
// @desc    Rufe die gespeicherten EA-Einstellungen des Benutzers ab
// @access  Private
router.get('/settings', auth, async (req, res) => {
  try {
    const eaSettings = await EaSettings.findOne({ user: req.user.id });

    if (!eaSettings) {
      return res.status(404).json({ msg: 'Keine Einstellungen gefunden' });
    }

    res.json(eaSettings);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server-Fehler');
  }
});

module.exports = router;
