const express = require("express");
const router = express.Router();

// Página de inicio
router.get("/", (req, res) => {
  const mensaje = req.session.mensaje;
  delete req.session.mensaje; // Limpiar el mensaje después de usarlo
  res.render("index", {
    title: "Inicio",
    message: "Bienvenido a la Gestión de Restaurantes",
    mensaje: mensaje, // Pasar el mensaje de éxito si existe
  });
});

module.exports = router;
