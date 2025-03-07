const jwt = require('jsonwebtoken');
const { Cliente } = require('../models');
const httpErrors = require('http-errors');

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'Lax' : 'Strict',
  domain: process.env.COOKIE_DOMAIN,
};

exports.authenticate = async (req, res, next) => {
  const token = req.cookies.accessToken;
  if (!token) return next(httpErrors(401, "Acceso no autorizado"));

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await Cliente.findByPk(decoded.dni);
    next();
  } catch (err) {
    next(httpErrors(401, "Token inválido o expirado"));
  }
};

exports.requireAdmin = (req, res, next) => {
  if (req.user?.tipo_cliente !== 'admin') {
    return next(httpErrors(403, "Acceso restringido a administradores"));
  }
  next();
};

exports.refreshToken = async (req, res, next) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return next(httpErrors(401, "Refresh token requerido"));

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await Cliente.findByPk(decoded.dni);
    
    if (!user || user.refreshToken !== refreshToken) {
      return next(httpErrors(403, "Token inválido"));
    }

    const newAccessToken = jwt.sign(
      { dni: user.dni, role: user.tipo_cliente },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );
    
    res.cookie('accessToken', newAccessToken, {
      ...cookieOptions,
      maxAge: 15 * 60 * 1000 // 15 min
    });
    
    req.user = user;
    next();
  } catch (err) {
    next(httpErrors(403, "Token inválido"));
  }
};