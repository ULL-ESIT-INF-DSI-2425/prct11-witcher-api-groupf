import request from 'supertest';
import { describe, it, expect, beforeEach } from 'vitest';
import app from '../src/index.js'; // Asegúrate de que la ruta sea correcta

describe('API Tests', () => {
  let mercaderId: string;
  let clienteId: string;
  let bienId: string;

  beforeEach(async () => {
    await request(app).delete('/bienes'); // Limpia la colección de bienes
    await request(app).delete('/mercaderes');
    await request(app).delete('/clientes');
    await request(app).delete('/transacciones');
  });

  // Test para la ruta POST /mercaderes
  it('Debería crear un nuevo mercader', async () => {
    const response = await request(app)
      .post('/mercaderes')
      .send({
        nombre: 'Zoltan',
        tienda: 'Tienda de Reliquias',
        ubicacion: 'Oxenfurt',
        especialidad: 'Miscelánea',
        reputacion: 5,
        dinero: 2000,
        inventario: [],
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('_id');
    expect(response.body.nombre).toBe('Zoltan');
    mercaderId = response.body._id;
  });

  // Test para la ruta POST /clientes
  it('Debería crear un nuevo cliente', async () => {
    const response = await request(app)
      .post('/clientes')
      .send({
        nombre: 'Geralt',
        tipo: 'Brujo',
        dinero: 500,
        bienes: [],
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('_id');
    expect(response.body.nombre).toBe('Geralt');
    clienteId = response.body._id;
  });

  // Test para la ruta POST /bienes
  it('Debería crear un nuevo bien', async () => {
    const response = await request(app)
      .post('/bienes')
      .send({
        idUnico: 'espada-plata',
        nombre: 'Espada de Plata',
        descripcion: 'Una espada mágica para monstruos',
        valor: 200,
        tipo: 'arma',
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('_id');
    expect(response.body.nombre).toBe('Espada de Plata');
    bienId = response.body._id;
  });

  // Test para la ruta PATCH /mercaderes/:id
  it('Debería actualizar un mercader', async () => {
    const response = await request(app)
      .patch(`/mercaderes/${mercaderId}`)
      .send({ dinero: 2500 });

    expect(response.status).toBe(200);
    expect(response.body.dinero).toBe(2500);
  });

  // Test para la ruta GET /mercaderes/:id
  it('Debería obtener un mercader por su ID', async () => {
    const response = await request(app).get(`/mercaderes/${mercaderId}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('_id', mercaderId);
  });

  // Test para la ruta DELETE /mercaderes/:id
  it('Debería eliminar un mercader', async () => {
    const response = await request(app).delete(`/mercaderes/${mercaderId}`);
    expect(response.status).toBe(200);
    expect(response.body.mensaje).toBe('Mercader eliminado correctamente.');
  });

  // Test para la ruta POST /transacciones
  it('Debería crear una nueva transacción', async () => {
    // Añade el bien al inventario del mercader
    await request(app)
      .patch(`/mercaderes/${mercaderId}`)
      .send({ inventario: [bienId] });

    const response = await request(app)
      .post('/transacciones')
      .send({
        mercaderId,
        clienteId,
        bienes: [bienId],
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('_id');
    expect(response.body.mercaderId).toBe(mercaderId);
    expect(response.body.clienteId).toBe(clienteId);
  });

  // Test para la ruta GET /transacciones
  it('Debería obtener todas las transacciones', async () => {
    const response = await request(app).get('/transacciones');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  // Test para la ruta OPTIONS /bienes/ordenar
  it('Debería ordenar los bienes por nombre en orden ascendente', async () => {
    await request(app).post('/bienes').send({
      idUnico: 'escudo-acero',
      nombre: 'Escudo de Acero',
      descripcion: 'Un escudo resistente',
      valor: 150,
      tipo: 'armadura',
    });

    await request(app).post('/bienes').send({
      idUnico: 'espada-plata',
      nombre: 'Espada de Plata',
      descripcion: 'Una espada mágica para monstruos',
      valor: 200,
      tipo: 'arma',
    });

    const response = await request(app)
      .options('/bienes/ordenar')
      .send({ ordenar: 'nombre', ascendente: true });

    expect(response.status).toBe(200);
    expect(response.body[0].nombre).toBe('Escudo de Acero');
    expect(response.body[1].nombre).toBe('Espada de Plata');
  });
});