const express = require("express");
const router = express.Router();
const clienteController = require("../controllers/clienteController");
const { authenticate } = require('../middleware/auth');

router.post("/registro", clienteController.registrarCliente);
router.post("/login", clienteController.iniciarSesion);
router.get("/:dni", clienteController.obtenerClientePorDni);
router.put("/:dni", clienteController.actualizarCliente);
router.delete("/:dni", clienteController.eliminarCliente);
router.get("/registro/view", clienteController.renderRegistro);
router.get("/login/view", clienteController.renderLogin);
router.get("/logout", clienteController.logoutCliente);
router.get("/dashboard", authenticate, clienteController.renderDashboard);

module.exports = router;
