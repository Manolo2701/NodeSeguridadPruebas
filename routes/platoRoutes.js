const express = require("express");
const router = express.Router();
const platoController = require("../controllers/platoController");

// Rutas para la API
router.post("/", platoController.crearPlato);
router.get("/", platoController.obtenerPlatos);
router.get("/:id", platoController.obtenerPlatoPorId);
router.put("/:id", platoController.actualizarPlato);
router.delete("/:id", platoController.eliminarPlato);

// Rutas para las vistas
router.get("/crear/view", platoController.renderCrearPlato);
router.get("/lista/view", platoController.renderListaPlatos);
router.get("/editar/:id", platoController.renderEditarPlato);

module.exports = router;
