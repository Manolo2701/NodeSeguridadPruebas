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

// Configuración de seguridad
app.use(helmet());

// Configuración de rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);

// Middleware globales
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      sameSite: 'Strict',
    },
  })
);

// Configuración de CSRF
if (process.env.NODE_ENV !== 'test') {
  app.use(csrf({ cookie: true }));
  app.use((req, res, next) => {
    res.locals.csrfToken = req.csrfToken();
    next();
  });
}

// Configurar EJS
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Importar rutas
const clienteRoutes = require('./routes/clienteRoutes');
const reservaRoutes = require('./routes/reservaRoutes');
const platoRoutes = require('./routes/platoRoutes');
const homeRoutes = require('./routes/homeRoutes');
const authRoutes = require('./routes/authRoutes');

// Usar rutas
app.use('/', homeRoutes);
app.use('/api/clientes', clienteRoutes);
app.use('/api/reservas', reservaRoutes);
app.use('/api/platos', platoRoutes);
app.use('/auth', authRoutes);

// Manejo de rutas no encontradas
app.use((req, res, next) => {
  res.status(404).json({ message: 'Ruta no encontrada' });
});

// Middleware de manejo de errores
app.use(errorHandler);

// Sincronización de la base de datos solo en entorno de producción
if (process.env.NODE_ENV !== 'test') {
  sequelize
    .sync()
    .then(() => {
      logger.info('Base de datos sincronizada');
    })
    .catch((error) => {
      logger.error('Error al sincronizar la BD:', { error: error.toString() });
      if (error.original) {
        logger.error('Error original:', {
          message: error.original.message,
          code: error.original.code,
        });
      }
    });

  // Leer certificados SSL
  const options = {
    key: fs.readFileSync('./ssl/key.pem'),
    cert: fs.readFileSync('./ssl/cert.pem'),
  };

  // Iniciar servidor HTTPS
  const PORT = process.env.PORT || 3000;
  https.createServer(options, app).listen(PORT, () => {
    logger.info(`Servidor HTTPS corriendo en https://localhost:${PORT}`);
  });

  // Redirigir HTTP a HTTPS
  http.createServer((req, res) => {
    res.writeHead(301, { Location: `https://${req.headers.host}${req.url}` });
    res.end();
  }).listen(80, () => {
    logger.info('Servidor HTTP redirigiendo a HTTPS en el puerto 80');
  });
} else {
  // Para entorno de prueba, solo exportamos la app
  logger.info('Aplicación configurada para pruebas');
}

// Manejo de cierre graceful
process.on('SIGTERM', () => {
  logger.info('SIGTERM recibido. Cerrando servidor.');
  process.exit(0);
});

module.exports = app;
