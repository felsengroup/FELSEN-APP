const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

const app = express();

connectDB();

app.use(express.json());

app.get('/', (req, res) => res.send('Felsen Backend API ist gestartet'));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/profile', require('./routes/profile')); // <-- Neue Route hier einfügen
app.use('/api/license', require('./routes/license')); // <-- Neue Route hier einfügen
app.use('/api/ea', require('./routes/ea')); // <-- Neue Route hier einfügen
app.use('/api/mt5', require('./routes/mt5')); // <-- Neue Route hier einfügen
app.use('/api/webhooks', require('./routes/webhook')); // <-- Neue Route hier einfügen
app.use('/api/mt5_api', require('./routes/mt5_api')); // <-- Neue Route hier einfügen

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server läuft auf Port ${PORT}`));
