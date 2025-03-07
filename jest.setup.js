require("dotenv").config({ path: ".env.test" });
const { sequelize } = require("./config/database");

beforeAll(async () => {
  try {
    await sequelize.sync({ force: true });
    console.log("Tablas creadas:", Object.keys(sequelize.models));
  } catch (error) {
    console.error("Error al sincronizar la base de datos:", error);
  }
});

afterAll(async () => {
  try {
    await sequelize.close();
    console.log("Conexión a la base de datos cerrada.");
  } catch (error) {
    console.error("Error al cerrar la conexión a la base de datos:", error);
  }
});