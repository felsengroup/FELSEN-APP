const mongoose = require('mongoose');

const Mt5AccountSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  login: { // Kontonummer des Broker-Kontos
    type: String,
    required: true,
  },
  password: { // Passwort für das Broker-Konto
    type: String,
    required: true,
  },
  server: { // Server des Brokers
    type: String,
    required: true,
  },
  // Weitere Felder können hinzugefügt werden, z.B. 'brokerName', 'accountType' etc.
});

module.exports = mongoose.model('Mt5Account', Mt5AccountSchema);
