const Cliente = require("../models/Cliente");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { body, validationResult } = require("express-validator");
const httpErrors = require("http-errors");

bcrypt.setRandomFallback((len) => crypto.randomBytes(len));

const generarTokens = async (cliente) => {
  const accessToken = jwt.sign(
    { dni: cliente.dni, role: cliente.tipo_cliente },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );

  const refreshToken = jwt.sign(
    { dni: cliente.dni },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
  );

  await cliente.update({ refreshToken });
  return { accessToken, refreshToken };
};

const registrarCliente = [
  body("dni")
    .isLength({ min: 9, max: 9 })
    .withMessage("DNI debe tener 9 caracteres"),
  body("email").isEmail().withMessage("Email no válido"),
  body("contrasena")
    .isLength({ min: 6 })
    .withMessage("La contraseña debe tener al menos 6 caracteres"),
  body("nombre").notEmpty().withMessage("El nombre es requerido"),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { nombre, email, contrasena, dni } = req.body;

      const clienteExistente = await Cliente.findOne({ where: { email } });
      if (clienteExistente) {
        throw httpErrors(400, "El cliente ya está registrado.");
      }

      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(contrasena, salt);

      const nuevoCliente = await Cliente.create({
        nombre,
        email,
        password_hash: hash,
        dni,
      });

      res
        .status(201)
        .json({ message: "Registro exitoso", cliente: nuevoCliente });
    } catch (error) {
      next(error);
    }
  },
];

const iniciarSesion = [
  body("email").isEmail().withMessage("Email no válido"),
  body("contrasena").notEmpty().withMessage("La contraseña es requerida"),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { email, contrasena } = req.body;
      const cliente = await Cliente.findOne({ where: { email } });
      if (!cliente) {
        throw httpErrors(401, "Credenciales incorrectas.");
      }

      const validPassword = await bcrypt.compare(
        contrasena,
        cliente.password_hash
      );
      if (!validPassword) {
        throw httpErrors(401, "Credenciales incorrectas.");
      }

      const { accessToken, refreshToken } = await generarTokens(cliente);

      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
        maxAge: 15 * 60 * 1000, // 15 min
      });

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días
      });

      res.json({ message: "Inicio de sesión exitoso." });
    } catch (error) {
      next(error);
    }
  },
];

const obtenerClientePorDni = async (req, res) => {
  try {
    const cliente = await Cliente.findByPk(req.params.dni);
    if (!cliente) {
      return res.status(404).render("error", {
        title: "Cliente No Encontrado",
        mensaje: "Cliente no encontrado.",
        error: {},
      });
    }
    res.json(cliente);
  } catch (error) {
    res.status(500).render("error", {
      title: "Error al Obtener Cliente",
      mensaje: "Error al obtener cliente.",
      error,
    });
  }
};

const actualizarCliente = async (req, res) => {
  try {
    const cliente = await Cliente.findByPk(req.params.dni);
    if (!cliente) {
      return res.status(404).render("error", {
        title: "Cliente No Encontrado",
        mensaje: "Cliente no encontrado.",
        error: {},
      });
    }
    await cliente.update(req.body);
    res.json({ message: "Cliente actualizado.", cliente });
  } catch (error) {
    res.status(500).render("error", {
      title: "Error al Actualizar Cliente",
      mensaje: "Error al actualizar cliente.",
      error,
    });
  }
};

const eliminarCliente = async (req, res) => {
  try {
    const cliente = await Cliente.findByPk(req.params.dni);
    if (!cliente) {
      return res.status(404).render("error", {
        title: "Cliente No Encontrado",
        mensaje: "Cliente no encontrado.",
        error: {},
      });
    }
    await cliente.destroy();
    res.json({ message: "Cliente eliminado." });
  } catch (error) {
    res.status(500).render("error", {
      title: "Error al Eliminar Cliente",
      mensaje: "Error al eliminar cliente.",
      error,
    });
  }
};

const renderRegistro = (req, res) => {
  res.render("registro", { title: "Registro de Cliente" });
};

const renderLogin = (req, res) => {
  res.render("login", { title: "Iniciar Sesión" });
};

const logoutCliente = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error al cerrar sesión:", err);
      return res.status(500).render("error", {
        title: "Error al Cerrar Sesión",
        mensaje: "No se pudo cerrar la sesión.",
      });
    }
    res.redirect("/");
  });
};

const renderDashboard = async (req, res) => {
  res.render("dashboard", { title: "Dashboard" });
};

const renderSuccess = (req, res) => {
  res.render("success", {
    title: "Operación Exitosa",
    message: req.query.message || "La operación se completó con éxito.",
  });
};

module.exports = {
  registrarCliente,
  iniciarSesion,
  obtenerClientePorDni,
  actualizarCliente,
  eliminarCliente,
  renderRegistro,
  renderLogin,
  logoutCliente,
  renderDashboard,
  renderSuccess,
};
