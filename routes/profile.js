const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const EaSettings = require('../models/EaSettings');
const Mt5Account = require('../models/Mt5Account');

// @route    GET /api/profile
// @desc     Benutzerprofil abrufen
// @access   Private
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server-Fehler');
  }
});

// @route    PATCH /api/profile
// @desc     Aktualisiere Benutzerdaten (E-Mail, Passwort)
// @access   Private
router.patch('/', auth, async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'Benutzer nicht gefunden' });
    }

    if (email) user.email = email;
    if (password) user.password = password;

    await user.save();
    res.json({ msg: 'Profil erfolgreich aktualisiert' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server-Fehler');
  }
});

// @route    DELETE /api/profile
// @desc     Lösche Benutzerkonto und alle verknüpften Daten
// @access   Private
router.delete('/', auth, async (req, res) => {
  try {
    await EaSettings.findOneAndRemove({ user: req.user.id });
    await Mt5Account.findOneAndRemove({ user: req.user.id });
    await User.findByIdAndRemove(req.user.id);

    res.json({ msg: 'Benutzerkonto und alle Daten erfolgreich gelöscht' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server-Fehler');
  }
});

module.exports = router;
