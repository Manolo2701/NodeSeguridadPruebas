const Cliente = require("./Cliente");
const Reserva = require("./Reserva");
const Plato = require("./Plato");

// Definir asociaciones
Cliente.hasMany(Reserva, {
  foreignKey: "dni",
  onDelete: "CASCADE",
  as: "reservas",
});
Reserva.belongsTo(Cliente, { foreignKey: "dni", as: "cliente" });

Reserva.hasMany(Plato, {
  foreignKey: "reservaId",
  as: "platos",
  onDelete: "CASCADE",
});
Plato.belongsTo(Reserva, { foreignKey: "reservaId", as: "reserva" });

module.exports = {
  Cliente,
  Reserva,
  Plato,
};
