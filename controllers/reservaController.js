const Reserva = require("../models/Reserva");
const { body, validationResult } = require("express-validator");

const crearReserva = [
  body("mesa")
    .isInt({ min: 1 })
    .withMessage("El número de mesa debe ser un entero positivo"),
  body("fecha").isISO8601().toDate().withMessage("La fecha debe ser válida"),
  body("estado")
    .isIn(["pendiente", "confirmada", "cancelada"])
    .withMessage("Estado no válido"),
  body("dni")
    .isLength({ min: 9, max: 9 })
    .withMessage("DNI debe tener 9 caracteres"),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("error", {
        title: "Error al Crear Reserva",
        message: errors
          .array()
          .map((err) => err.msg)
          .join(", "),
        error: {},
      });
    }

    try {
      const { mesa, fecha, estado, dni } = req.body;
      const reserva = await Reserva.create({ mesa, fecha, estado, dni });
      res.status(201).json({ message: "Reserva creada.", reserva });
    } catch (error) {
      res.status(500).render("error", {
        title: "Error al Crear Reserva",
        message: "Error al crear reserva.",
        error,
      });
    }
  },
];

const obtenerReservas = async (req, res) => {
  try {
    const reservas = await Reserva.findAll();
    res.json(reservas);
  } catch (error) {
    res.status(500).render("error", {
      title: "Error al Obtener Reservas",
      message: "Error al obtener reservas.",
      error,
    });
  }
};

const obtenerReservaPorId = async (req, res) => {
  try {
    const reserva = await Reserva.findByPk(req.params.id);
    if (!reserva) {
      return res.status(404).render("error", {
        title: "Reserva No Encontrada",
        message: "Reserva no encontrada.",
        error: {},
      });
    }
    res.json(reserva);
  } catch (error) {
    res.status(500).render("error", {
      title: "Error al Obtener Reserva",
      message: "Error al obtener reserva.",
      error,
    });
  }
};

const actualizarReserva = async (req, res) => {
  try {
    const reserva = await Reserva.findByPk(req.params.id);
    if (!reserva) {
      return res.status(404).render("error", {
        title: "Reserva No Encontrada",
        message: "Reserva no encontrada.",
        error: {},
      });
    }
    await reserva.update(req.body);
    res.json({ message: "Reserva actualizada.", reserva });
  } catch (error) {
    res.status(500).render("error", {
      title: "Error al Actualizar Reserva",
      message: "Error al actualizar reserva.",
      error,
    });
  }
};

const eliminarReserva = async (req, res) => {
  try {
    const reserva = await Reserva.findByPk(req.params.id);
    if (!reserva) {
      return res.status(404).render("error", {
        title: "Reserva No Encontrada",
        message: "Reserva no encontrada.",
        error: {},
      });
    }
    await reserva.destroy();
    res.json({ message: "Reserva eliminada." });
  } catch (error) {
    res.status(500).render("error", {
      title: "Error al Eliminar Reserva",
      message: "Error al eliminar reserva.",
      error,
    });
  }
};

const renderCrearReserva = (req, res) => {
  res.render("crearReserva", { title: "Crear Reserva" });
};

const renderListaReservas = async (req, res) => {
  try {
    const reservas = await Reserva.findAll();
    res.render("reservas", { title: "Lista de Reservas", reservas });
  } catch (error) {
    res.status(500).render("error", {
      title: "Error al Renderizar Reservas",
      message: "Error al renderizar reservas.",
      error,
    });
  }
};

const renderEditarReserva = async (req, res) => {
  try {
    const reserva = await Reserva.findByPk(req.params.id);
    if (!reserva) {
      return res
        .status(404)
        .render("error", {
          title: "Reserva no encontrada",
          message: "La reserva solicitada no existe.",
        });
    }
    res.render("editarReserva", { title: "Editar Reserva", reserva });
  } catch (error) {
    res
      .status(500)
      .render("error", {
        title: "Error",
        message: "Ocurrió un error al cargar la reserva.",
      });
  }
};

module.exports = {
  crearReserva,
  obtenerReservas,
  obtenerReservaPorId,
  actualizarReserva,
  eliminarReserva,
  renderCrearReserva,
  renderListaReservas,
  renderEditarReserva,
};
