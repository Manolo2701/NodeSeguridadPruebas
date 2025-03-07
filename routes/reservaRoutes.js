const express = require("express");
const router = express.Router();
const reservaController = require("../controllers/reservaController");

router.post("/", reservaController.crearReserva);
router.get("/", reservaController.obtenerReservas);
router.get("/:id", reservaController.obtenerReservaPorId);
router.put("/:id", reservaController.actualizarReserva);
router.delete("/:id", reservaController.eliminarReserva);
router.get("/crear/view", reservaController.renderCrearReserva);
router.get("/lista/view", reservaController.renderListaReservas);
router.get("/editar/:id", reservaController.renderEditarReserva);

module.exports = router;
