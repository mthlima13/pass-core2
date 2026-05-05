require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');

const entryRoutes = require('./routes/entryRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const utilsRoutes = require('./routes/utilsRoutes');
const rateLimiter = require('./middlewares/rateLimiter');
const sanitize = require('./middlewares/sanitize');

const app = express();

// Middlewares de segurança
app.use(helmet());
app.use(cors());
app.use(rateLimiter);
app.use(express.json());
app.use(sanitize);

// Conexão MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/passcore2';
mongoose.connect(MONGODB_URI)
  .then(() => console.log('✓ Conectado ao MongoDB'))
  .catch(err => console.error('✗ Erro na conexão MongoDB:', err));

// Rotas
app.use('/api/entries', entryRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/utils', utilsRoutes);

// Health Check
app.get('/health', (req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✓ Servidor rodando na porta ${PORT}`);
});

module.exports = app;
