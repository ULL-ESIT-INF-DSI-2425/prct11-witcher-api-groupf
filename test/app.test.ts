import request from 'supertest';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import app from '../src/index.js';
import { v4 as uuidv4 } from 'uuid';

describe('API Tests', () => {
  let mercaderId: string;
  let clienteId: string;
  let bienId: string;
  let transaccionId: string;

  beforeAll(async () => {
    await request(app).delete('/bienes');
    await request(app).delete('/mercaderes');
    await request(app).delete('/clientes');
    await request(app).delete('/transacciones');
  });

  afterAll(async () => {
    await request(app).delete('/bienes');
    await request(app).delete('/mercaderes');
    await request(app).delete('/clientes');
    await request(app).delete('/transacciones');
  });

  // Test para la ruta POST /mercaderes
  it('Debería crear un nuevo mercader', async () => {
    const response = await request(app)
      .post('/mercaderes')
      .send({
        nombre: `Mercader-${uuidv4()}`,
        tienda: `Tienda-${uuidv4()}`,
        ubicacion: 'Oxenfurt',
        especialidad: 'Miscelánea',
        reputacion: 5,
        dinero: 2000,
        inventario: [],
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('_id');
    mercaderId = response.body._id;
  });

  // Test para la ruta POST /clientes
  it('Debería crear un nuevo cliente', async () => {
    const response = await request(app)
      .post('/clientes')
      .send({
        nombre: `Cliente-${uuidv4()}`,
        tipo: 'Brujo',
        dinero: 500,
        bienes: [],
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('_id');
    clienteId = response.body._id;
  });

  // Test para la ruta POST /bienes
  it('Debería crear un nuevo bien', async () => {
    const response = await request(app)
      .post('/bienes')
      .send({
        idUnico: `Bien-${uuidv4()}`,
        nombre: `Bien-${uuidv4()}`,
        descripcion: 'Una espada mágica para monstruos',
        valor: 200,
        tipo: 'arma',
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('_id');
    bienId = response.body._id;
  });

  // Test para la ruta GET /bienes/:id/obtener-valor
  it('Debería obtener el valor de un bien por ID', async () => {
    const response = await request(app).get(`/bienes/${bienId}/obtener-valor`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('valor', 200);
  });

  // Test para la ruta PATCH /mercaderes/:id
  it('Debería actualizar un mercader', async () => {
    const response = await request(app)
      .patch(`/mercaderes/${mercaderId}`)
      .send({ dinero: 3000 });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('dinero', 3000);
  });

  // Test para la ruta PATCH /clientes/:id
  it('Debería actualizar un cliente', async () => {
    const response = await request(app)
      .patch(`/clientes/${clienteId}`)
      .send({ dinero: 1000 });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('dinero', 1000);
  });

  // Test para la ruta OPTIONS /clientes/ordenar
  it('Debería ordenar los clientes por nombre en orden ascendente', async () => {
    await request(app).post('/clientes').send({
      nombre: `ClienteA-${uuidv4()}`,
      tipo: 'Brujo',
      dinero: 1000,
      bienes: [],
    });

    await request(app).post('/clientes').send({
      nombre: `ClienteB-${uuidv4()}`,
      tipo: 'Brujo',
      dinero: 1500,
      bienes: [],
    });

    const response = await request(app)
      .options('/clientes/ordenar')
      .send({ ordenar: 'nombre', ascendente: true });

    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
  });

  // Test para la ruta OPTIONS /bienes/ordenar
  it('Debería ordenar los bienes por nombre en orden descendente', async () => {
    await request(app).post('/bienes').send({
      idUnico: `Bien-${uuidv4()}`,
      nombre: 'Escudo de Acero',
      descripcion: 'Un escudo resistente',
      valor: 150,
      tipo: 'armadura',
    });

    await request(app).post('/bienes').send({
      idUnico: `Bien-${uuidv4()}`,
      nombre: 'Espada de Plata',
      descripcion: 'Una espada mágica para monstruos',
      valor: 300,
      tipo: 'arma',
    });

    const response = await request(app)
      .options('/bienes/ordenar')
      .send({ ordenar: 'nombre', ascendente: false });

    expect(response.status).toBe(200);
    expect(response.body[0].nombre).toBe('Espada de Plata');
    expect(response.body[1].nombre).toBe('Escudo de Acero');
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
    transaccionId = response.body._id;
  });

  // Test para la ruta GET /transacciones/:id/total
  it('Debería obtener el total de una transacción por ID', async () => {
    const response = await request(app).get(`/transacciones/${transaccionId}/total`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('total');
  });

  // Test para la ruta DELETE /bienes/:id
  it('Debería eliminar un bien por ID', async () => {
    const response = await request(app).delete(`/bienes/${bienId}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('mensaje', 'Bien eliminado correctamente');
  });

  // Test para la ruta DELETE /clientes/:id
  it('Debería eliminar un cliente por ID', async () => {
    const response = await request(app).delete(`/clientes/${clienteId}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('mensaje', 'Cliente eliminado correctamente.');
  });

  // Test para la ruta DELETE /mercaderes/:id
  it('Debería eliminar un mercader por ID', async () => {
    const response = await request(app).delete(`/mercaderes/${mercaderId}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('mensaje', 'Mercader eliminado correctamente.');
  });
});