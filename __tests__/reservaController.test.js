const request = require('supertest');
const app = require('../app');
const { Reserva, Cliente } = require('../models');
const bcrypt = require('bcryptjs');

describe('Reserva Controller', () => {
  let cliente;

  beforeAll(async () => {
    // Crear un cliente antes de las pruebas
    cliente = await Cliente.create({
      dni: '12345678A',
      nombre: 'Test User',
      email: 'test@example.com',
      password_hash: await bcrypt.hash('password123', 10), // Hashear la contraseña
    });
  });

  it('debería crear una nueva reserva', async () => {
    const res = await request(app)
      .post('/api/reservas')
      .send({
        dni: cliente.dni, // Usar el DNI del cliente creado
        mesa: 1,
        fecha: '2025-03-15T20:00:00.000Z',
        estado: 'pendiente',
      });
    expect(res.statusCode).toBe(201);

    // Verificar que la reserva se haya creado en la base de datos
    const reserva = await Reserva.findOne({ where: { dni: cliente.dni } });
    expect(reserva).not.toBeNull();
  });

  it('debería obtener todas las reservas', async () => {
    const res = await request(app).get('/api/reservas');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBeTruthy();
  });
});