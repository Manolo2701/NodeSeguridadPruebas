const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Reserva = sequelize.define("Reserva", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  mesa: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  fecha: {
    type: DataTypes.DATE,
    allowNull: false,
    validate: {
      isAfter: new Date().toISOString().split('T')[0]
    }
  },  
  estado: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "pendiente",
  },
  // Nota: La clave foránea "dni" se definirá en la asociación
});

module.exports = Reserva;
