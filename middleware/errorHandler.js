const { ValidationError } = require("sequelize");
const httpErrors = require("http-errors");

module.exports = (err, req, res, next) => {
  console.error("Error:", err);

  if (err instanceof ValidationError) {
    return res.status(400).json({
      error: "Error de validación",
      details: err.errors.map((e) => e.message),
    });
  }

  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({ error: "Token inválido" });
  }

  if (err instanceof httpErrors.HttpError) {
    return res.status(err.statusCode).json({
      error: err.message,
      ...(err.details && { details: err.details }),
    });
  }

  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === "development" ? err.message : "Error interno del servidor",
  });
};