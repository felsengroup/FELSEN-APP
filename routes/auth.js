const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

// Erstelle einen Nodemailer-Transporter
const transporter = nodemailer.createTransport({
  service: 'Gmail', // Verwende deinen E-Mail-Anbieter
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// @route   POST /api/auth/register
// @desc    Registriere einen neuen Benutzer
// @access  Public
router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'Benutzer existiert bereits' });
    }

    user = new User({ email, password });
    await user.save();

    const payload = { user: { id: user.id } };

    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server-Fehler');
  }
});

// @route   POST /api/auth/login
// @desc    Melde einen Benutzer an & gib Token zurück
// @access  Public
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Ungültige Anmeldeinformationen' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Ungültige Anmeldeinformationen' });
    }

    const payload = { user: { id: user.id } };

    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server-Fehler');
  }
});

// @route   POST /api/auth/forgot-password
// @desc    Sende einen Link zum Zurücksetzen des Passworts
// @access  Public
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: 'Kein Benutzer mit dieser E-Mail gefunden.' });
    }

    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 Stunde
    await user.save();

    const mailOptions = {
      to: user.email,
      from: process.env.EMAIL_USER,
      subject: 'Passwort zurücksetzen',
      text: `Sie haben angefordert, Ihr Passwort zurückzusetzen.
Bitte klicken Sie auf diesen Link, um fortzufahren:
http://localhost:3000/reset-password/${resetToken}
Wenn Sie dies nicht angefordert haben, ignorieren Sie diese E-Mail.`,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ msg: 'E-Mail zum Zurücksetzen des Passworts wurde gesendet.' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server-Fehler beim Senden der E-Mail.');
  }
});

// @route   POST /api/auth/reset-password/:token
// @desc    Setze das Passwort zurück
// @access  Public
router.post('/reset-password/:token', async (req, res) => {
  const { password } = req.body;
  try {
    const user = await User.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ msg: 'Token ist ungültig oder abgelaufen.' });
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ msg: 'Passwort wurde erfolgreich zurückgesetzt.' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server-Fehler.');
  }
});

module.exports = router;
