const express = require('express');
const router = express.Router();
const axios = require('axios');
const auth = require('../middleware/auth');
const User = require('../models/User');

// @route    POST /api/license/activate
// @desc     Validate a Cryptolens license key
// @access   Private
router.post('/activate', auth, async (req, res) => {
  const { licenseKey } = req.body;

  // WICHTIG: Ersetze diese Platzhalter durch deine echten Werte
  const CRYPTOLENS_TOKEN = 'WyIxMTEwOTY3MjYiLCJuMjRaeU5oNlBzcmIvampFbzE5UHRhKzMxMEh2aExXdlphakVXSkp1Il0='; 
  const PRODUCT_ID = '30250';

  if (!licenseKey) {
    return res.status(400).json({ msg: 'Lizenzschlüssel ist erforderlich' });
  }

  try {
    const response = await axios.post('https://api.cryptolens.io/api/key/Activate', {
        token: CRYPTOLENS_TOKEN,
        ProductId: PRODUCT_ID,
        Key: licenseKey,
        MachineCode: req.user.id,
      },
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const cryptolensResponse = response.data;
    
    if (cryptolensResponse.result === 0) {
      // Wenn der Schlüssel gültig ist, wird hier die Freischaltung gespeichert
      res.json({ msg: 'Lizenzschlüssel erfolgreich aktiviert!', licenseDetails: cryptolensResponse });
    } else {
      res.status(400).json({ msg: cryptolensResponse.message, licenseDetails: cryptolensResponse });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server-Fehler bei der Lizenzvalidierung');
  }
});

module.exports = router;
