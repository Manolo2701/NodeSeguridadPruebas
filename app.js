require('dotenv').config();
const express = require('express');
const session = require('express-session');
const cors = require('cors');
const path = require('path');
const { sequelize } = require('./config/database');
const logger = require('./utils/logger');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const errorHandler = require('./middleware/errorHandler');
const https = require('https');
const fs = require('fs');
const http = require('http');
const csrf = require('csurf');

const app = express();

app.use(helmet());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'Strict',
  },
}));

if (process.env.NODE_ENV !== 'test') {
  app.use(csrf({ cookie: true }));
  app.use((req, res, next) => {
    res.locals.csrfToken = req.csrfToken();
    next();
  });
}

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

const clienteRoutes = require('./routes/clienteRoutes');
const reservaRoutes = require('./routes/reservaRoutes');
const platoRoutes = require('./routes/platoRoutes');
const homeRoutes = require('./routes/homeRoutes');
const authRoutes = require('./routes/authRoutes');

app.use('/', homeRoutes);
app.use('/api/clientes', clienteRoutes);
app.use('/api/reservas', reservaRoutes);
app.use('/api/platos', platoRoutes);
app.use('/auth', authRoutes);

app.use((req, res) => {
  res.status(404).json({ message: 'Ruta no encontrada' });
});
app.use(errorHandler);

if (process.env.NODE_ENV !== 'test') {
  sequelize.sync()
    .then(() => logger.info('Base de datos sincronizada'))
    .catch((error) => {
      logger.error('Error al sincronizar la BD:', { error: error.toString() });
      if (error.original) {
        logger.error('Error original:', {
          message: error.original.message,
          code: error.original.code,
        });
      }
    });

  const PORT = process.env.PORT || 3000;
  const keyPath = process.env.TLS_KEY_PATH || path.join(__dirname, 'ssl', 'key.pem');
  const certPath = process.env.TLS_CERT_PATH || path.join(__dirname, 'ssl', 'cert.pem');
  const hasCertificates = fs.existsSync(keyPath) && fs.existsSync(certPath);

  if (hasCertificates) {
    const options = {
      key: fs.readFileSync(keyPath),
      cert: fs.readFileSync(certPath),
    };
    https.createServer(options, app).listen(PORT, () => {
      logger.info(`Servidor HTTPS corriendo en https://localhost:${PORT}`);
    });
    http.createServer((req, res) => {
      res.writeHead(301, { Location: `https://${req.headers.host}${req.url}` });
      res.end();
    }).listen(process.env.HTTP_PORT || 8080, () => {
      logger.info('Redirección HTTP disponible en el puerto configurado');
    });
  } else if (process.env.NODE_ENV === 'production') {
    throw new Error('Faltan certificados TLS. Define TLS_KEY_PATH y TLS_CERT_PATH antes de iniciar en producción.');
  } else {
    http.createServer(app).listen(PORT, () => {
      logger.info(`Servidor HTTP local disponible en http://localhost:${PORT} (solo desarrollo)`);
    });
  }
}

process.on('SIGTERM', () => {
  logger.info('SIGTERM recibido. Cerrando servidor.');
  process.exit(0);
});

module.exports = app;
