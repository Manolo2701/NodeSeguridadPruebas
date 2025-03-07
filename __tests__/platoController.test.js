const request = require("supertest");
const app = require("../app");
const { Plato } = require("../models");

describe("Plato Controller", () => {
  it("debería crear un nuevo plato", async () => {
    const res = await request(app)
      .post("/api/platos")
      .send({
        nombre: "Plato Test",
        descripcion: "Descripción del plato test",
        precio: 10.99,
        categoria: "Entrada",
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe("Plato creado.");
    expect(res.body.plato).toBeDefined();

    // Verificar que el plato se haya creado en la base de datos
    const plato = await Plato.findOne({ where: { nombre: "Plato Test" } });
    expect(plato).not.toBeNull();
  });

  it("debería obtener todos los platos", async () => {
    const res = await request(app).get("/api/platos");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBeTruthy();
  });
});