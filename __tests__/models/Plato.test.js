const { Plato } = require('../../models');
const { sequelize } = require('../../config/database');

describe('Plato Model', () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true }); // Sincronizar la base de datos antes de las pruebas
  });

  afterAll(async () => {
    await sequelize.close(); // Cerrar la conexión después de las pruebas
  });

  it('debería crear un plato válido', async () => {
    const platoData = {
      nombre: 'Plato Test',
      descripcion: 'Descripción del plato test',
      precio: 10.99,
      categoria: 'Principal', // Incluimos la categoría obligatoria
    };
    const plato = await Plato.create(platoData);
    expect(plato.nombre).toBe(platoData.nombre);
    expect(plato.descripcion).toBe(platoData.descripcion);
    expect(plato.precio).toBe(platoData.precio);
    expect(plato.categoria).toBe(platoData.categoria); // Verificamos la categoría
  });

  it('no debería crear un plato con precio negativo', async () => {
    const platoData = {
      nombre: 'Plato Inválido',
      descripcion: 'Descripción',
      precio: -5.0, // Precio inválido
      categoria: 'Principal', // Incluimos la categoría obligatoria
    };
    await expect(Plato.create(platoData)).rejects.toThrow();
  });
});