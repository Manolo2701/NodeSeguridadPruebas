const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Cliente = sequelize.define("Cliente", {
  dni: {
    type: DataTypes.STRING(10),
    primaryKey: true,
    allowNull: false,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password_hash: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  tipo_cliente: {
    type: DataTypes.ENUM('admin', 'cliente'),
    allowNull: false,
    defaultValue: "cliente",
  },
  refreshToken: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

module.exports = Cliente;
