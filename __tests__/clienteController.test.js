const request = require('supertest');
const app = require('../app');
const { Cliente } = require('../models');
const { sequelize } = require('../config/database');
const bcrypt = require('bcryptjs');

describe('Cliente Controller', () => {

  it('debería registrar un nuevo cliente', async () => {
    const res = await request(app)
      .post('/api/clientes/registro')
      .send({
        dni: '12345678A',
        nombre: 'Test User',
        email: 'test@example.com',
        contrasena: 'password123',
      });
    expect(res.statusCode).toBe(201);
    const cliente = await Cliente.findOne({ where: { email: 'test@example.com' } });
    expect(cliente).not.toBeNull();
    expect(cliente.password_hash).not.toBe('password123');
    expect(await bcrypt.compare('password123', cliente.password_hash)).toBe(true);
  });

  it('debería iniciar sesión', async () => {
    const res = await request(app)
      .post('/api/clientes/login')
      .send({
        email: 'test@example.com',
        contrasena: 'password123',
      });
    expect(res.statusCode).toBe(200);
  });
});