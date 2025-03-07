const { Cliente } = require('../../models');
const bcrypt = require('bcryptjs');
const { sequelize } = require('../../config/database');

describe('Cliente Model', () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true }); // Sincronizar la base de datos antes de las pruebas
  });

  afterAll(async () => {
    await sequelize.close(); // Cerrar la conexión después de las pruebas
  });

  it('debería crear un cliente válido', async () => {
    const password = 'password123'; // Definir la contraseña como una cadena
    const hashedPassword = await bcrypt.hash(password, 10);
    const clienteData = {
      dni: '12345678A',
      nombre: 'Test User',
      email: 'test@example.com',
      password_hash: hashedPassword,
    };
    const cliente = await Cliente.create(clienteData);
    expect(cliente.dni).toBe(clienteData.dni);
    expect(cliente.nombre).toBe(clienteData.nombre);
    expect(cliente.email).toBe(clienteData.email);
  });

  it('no debería crear un cliente con email duplicado', async () => {
    const password = 'anotherpassword'; // Definir la contraseña como una cadena
    const hashedPassword = await bcrypt.hash(password, 10);
    const clienteData = {
      dni: '87654321B',
      nombre: 'Another User',
      email: 'test@example.com', // Email ya usado
      password_hash: hashedPassword,
    };
    await expect(Cliente.create(clienteData)).rejects.toThrow();
  });
});