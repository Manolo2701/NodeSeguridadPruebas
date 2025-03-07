const { Reserva, Cliente } = require('../../models');
const bcrypt = require('bcryptjs');
const { sequelize } = require('../../config/database');

describe('Reserva Model', () => {
  let cliente;

  beforeAll(async () => {
    await sequelize.sync({ force: true }); // Sincronizar la base de datos
    cliente = await Cliente.create({
      dni: '12345678C',
      nombre: 'Cliente Test',
      email: 'cliente@test.com',
      password_hash: await bcrypt.hash('testpassword', 10),
    });
  });

  afterAll(async () => {
    await sequelize.close(); // Cerrar la conexión después de las pruebas
  });

  it('debería crear una reserva válida', async () => {
    const reservaData = {
      dni: cliente.dni, // Usar cliente.dni en lugar de clienteId
      mesa: 1,
      fecha: new Date(),
      estado: 'pendiente',
    };
    const reserva = await Reserva.create(reservaData);
    expect(reserva.dni).toBe(cliente.dni);
  });

  it('no debería crear una reserva con fecha pasada', async () => {
    const reservaData = {
      dni: cliente.dni,
      mesa: 1,
      fecha: new Date('2020-01-01'),
      estado: 'pendiente',
    };
    await expect(Reserva.create(reservaData)).rejects.toThrow();
  });
});