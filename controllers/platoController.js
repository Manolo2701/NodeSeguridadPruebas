const Plato = require("../models/Plato");
const { body, validationResult } = require("express-validator");

// Función para crear un plato
const crearPlato = [
  body("nombre").notEmpty().withMessage("El nombre del plato es requerido"),
  body("precio")
    .isFloat({ min: 0 })
    .withMessage("El precio debe ser un número positivo"),
  body("descripcion").notEmpty().withMessage("La descripción es requerida"),
  body("categoria").notEmpty().withMessage("La categoría es requerida"),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        title: "Error al Crear Plato",
        message: errors
          .array()
          .map((err) => err.msg)
          .join(", "),
      });
    }

    try {
      const { nombre, precio, descripcion, categoria } = req.body;
      const plato = await Plato.create({
        nombre,
        precio,
        descripcion,
        categoria,
      });
      res.status(201).json({ message: "Plato creado.", plato });
    } catch (error) {
      console.error("Error al crear el plato:", error);
      res.status(500).json({
        title: "Error al Crear Plato",
        message: "Error al crear plato.",
        error:
          process.env.NODE_ENV === "development"
            ? error.message
            : "Error interno del servidor",
      });
    }
  },
];

// Función para obtener todos los platos
const obtenerPlatos = async (req, res) => {
  try {
    const platos = await Plato.findAll();
    res.json(platos);
  } catch (error) {
    console.error("Error al obtener los platos:", error);
    res.status(500).json({
      title: "Error al Obtener Platos",
      message: "Error al obtener platos.",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Error interno del servidor",
    });
  }
};

// Función para obtener un plato por su ID
const obtenerPlatoPorId = async (req, res) => {
  try {
    const plato = await Plato.findByPk(req.params.id);
    if (!plato) {
      return res.status(404).json({
        title: "Plato No Encontrado",
        message: "Plato no encontrado.",
      });
    }
    res.json(plato);
  } catch (error) {
    console.error("Error al obtener el plato:", error);
    res.status(500).json({
      title: "Error al Obtener Plato",
      message: "Error al obtener plato.",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Error interno del servidor",
    });
  }
};

// Función para actualizar un plato
const actualizarPlato = async (req, res) => {
  try {
    const plato = await Plato.findByPk(req.params.id);
    if (!plato) {
      return res.status(404).json({
        title: "Plato No Encontrado",
        message: "Plato no encontrado.",
      });
    }
    await plato.update(req.body);
    res.json({ message: "Plato actualizado.", plato });
  } catch (error) {
    console.error("Error al actualizar el plato:", error);
    res.status(500).json({
      title: "Error al Actualizar Plato",
      message: "Error al actualizar plato.",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Error interno del servidor",
    });
  }
};

// Función para eliminar un plato
const eliminarPlato = async (req, res) => {
  try {
    const plato = await Plato.findByPk(req.params.id);
    if (!plato) {
      return res.status(404).json({
        title: "Plato No Encontrado",
        message: "Plato no encontrado.",
      });
    }
    await plato.destroy();
    res.json({ message: "Plato eliminado." });
  } catch (error) {
    console.error("Error al eliminar el plato:", error);
    res.status(500).json({
      title: "Error al Eliminar Plato",
      message: "Error al eliminar plato.",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Error interno del servidor",
    });
  }
};

// Función para renderizar la vista de creación de platos
const renderCrearPlato = (req, res) => {
  res.render("crearPlato", { title: "Crear Plato" });
};

// Función para renderizar la vista de lista de platos
const renderListaPlatos = async (req, res) => {
  try {
    const platos = await Plato.findAll();
    res.render("platos", { title: "Lista de Platos", platos });
  } catch (error) {
    console.error("Error al obtener los platos:", error);
    res.status(500).render("error", {
      title: "Error al Renderizar Platos",
      message: "Error al renderizar platos.",
      error,
    });
  }
};

const renderEditarPlato = async (req, res) => {
  try {
    const plato = await Plato.findByPk(req.params.id);
    if (!plato) {
      return res
        .status(404)
        .render("error", {
          title: "Plato no encontrado",
          message: "El plato solicitado no existe.",
        });
    }
    res.render("editarPlato", { title: "Editar Plato", plato });
  } catch (error) {
    res
      .status(500)
      .render("error", {
        title: "Error",
        message: "Ocurrió un error al cargar el plato.",
      });
  }
};

module.exports = {
  crearPlato,
  obtenerPlatos,
  obtenerPlatoPorId,
  actualizarPlato,
  eliminarPlato,
  renderCrearPlato,
  renderListaPlatos,
  renderEditarPlato,
};
