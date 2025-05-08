import { describe, test, beforeEach, expect } from "vitest";
import request from "supertest";
import { app } from "../src/app.js";
import { Mercader } from "../src/schemas/mercader.model.js";
import { Cliente } from "../src/schemas/cliente.model.js";
import { Bien } from "../src/schemas/bien.model.js";


let bienId: string;
let mercaderId: string;
let clienteId: string;
let transaccionId: string;

beforeEach(async () => {
  await Bien.deleteMany({});
  await Mercader.deleteMany({});
  await Cliente.deleteMany({});  


  const resBien = await request(app).post('/bienes').send({
    nombre: 'Espada de plata',
    descripcion: 'Ideal para monstruos',
    valor: 100,
    tipo: 'arma'
  });
  bienId = resBien.body._id;

  const resMercader = await request(app).post('/mercaderes').send({
    nombre: 'Hattori',
    tienda: 'Forja Élite',
    ubicacion: 'Novigrado',
    especialidad: 'Armas',
    reputacion: 5,
    dinero: 1000,
    inventario: [
      {
        bienId,
        cantidad: 10
      }
    ]
  });
  mercaderId = resMercader.body._id;

  const resCliente = await request(app).post('/clientes').send({
    nombre: 'Geralt',
    tipo: 'Brujo',
    dinero: 500,
    bienes: [] 
  });
  clienteId = resCliente.body._id;
});




describe('Pruebas de Transacciones - POST y GET', () => {

  test('Debería crear una transacción correctamente (POST /transacciones)', async () => {
    const res = await request(app).post('/transacciones').send({
      clienteId,
      mercaderId,
      bienes: [
        {
          bienId,
          cantidad: 2
        }
      ]
    });
    console.log('####################   CREAR TRANSACCION:', res.status, res.body); 
    console.log('Bien ID:', bienId);
    console.log('Mercader ID:', mercaderId);
    console.log('Cliente ID:', clienteId);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('_id');
    transaccionId = res.body._id;
  });

  test('Debería obtener todas las transacciones (GET /transacciones)', async () => {
    const res = await request(app).get('/transacciones');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  test('Debería obtener una transacción por ID (GET /transacciones/:id)', async () => {
    const res = await request(app).get(`/transacciones/${transaccionId}`);
    expect(res.status).toBe(200);
    expect(res.body._id).toBe(transaccionId);
  });
});

describe('Validaciones de transacción (casos negativos)', () => { 
  test('Error si el mercader no existe', async () => {
    const res = await request(app).post('/transacciones').send({
      clienteId,
      mercaderId: '666666666666666666666666',
      bienes: [{ bienId, cantidad: 1 }]
    });
    expect(res.status).toBe(404);
    expect(res.body.mensaje).toMatch(/mercader.*no encontrado/i);
  });

  test('Error si el cliente no existe', async () => {
    const res = await request(app).post('/transacciones').send({
      clienteId: '666666666666666666666666',
      mercaderId,
      bienes: [{ bienId, cantidad: 1 }]
    });
    expect(res.status).toBe(404);
    expect(res.body.mensaje).toMatch(/cliente.*no encontrado/i);
  });

  test('Error si el bien no existe', async () => {
    const res = await request(app).post('/transacciones').send({
      clienteId,
      mercaderId,
      bienes: [{ bienId: '666666666666666666666666', cantidad: 1 }]
    });
    expect(res.status).toBe(404);
    expect(res.body.mensaje).toMatch(/bien.*no encontrado/i);
  });
  
  test('Error si el cliente no tiene suficiente dinero', async () => {
    const res = await request(app).post('/transacciones').send({
      clienteId,
      mercaderId,
      bienes: [{ bienId, cantidad: 100 }] 
    });
    expect(res.status).toBe(400);
    expect(res.body.mensaje).toMatch(/suficiente dinero/i);
  });
  

  test('Error si el mercader no tiene suficiente cantidad del bien', async () => {
    const res = await request(app).post('/transacciones').send({
      clienteId,
      mercaderId,
      bienes: [{ bienId, cantidad: 999 }]
    });
    expect(res.status).toBe(400);
    expect(res.body.mensaje).toMatch("El cliente no tiene suficiente dinero para realizar la transacción");
  });
  
  
  test('DELETE - transacción no encontrada', async () => {
    const res = await request(app).delete('/transacciones/666666666666666666666666');
    expect(res.status).toBe(404);
  });
  
 });


 describe('PATCH y DELETE de transacciones', () => {
  test('Debería actualizar una transacción existente (PATCH /transacciones/:id)', async () => {
    const resCrear = await request(app).post('/transacciones').send({
      clienteId,
      mercaderId,
      bienes: [
        {
          bienId,
          cantidad: 1
        }
      ]
    });
    const idTransaccion = resCrear.body._id;

    const res = await request(app).patch(`/transacciones/${idTransaccion}`).send({
      bienes: [
        {
          bienId,
          cantidad: 2
        }
      ],
    });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('mensaje', 'Transacción actualizada correctamente.');
    expect(res.body.transaccion.bienes[0].cantidad).toBe(2);
    expect(res.body.transaccion.bienes[0].bienId).toBe(bienId);
    expect(res.body.transaccion._id).toBe(idTransaccion);
  });

  test('No debería permitir modificar el ID (PATCH /transacciones/:id)', async () => {
    const resCrear = await request(app).post('/transacciones').send({
      clienteId,
      mercaderId,
      bienes: [{ bienId, cantidad: 1 }]
    });

    const res = await request(app)
      .patch(`/transacciones/${resCrear.body._id}`)
      .send({ _id: 'modificado' });

    expect(res.status).toBe(400);
    expect(res.body.mensaje).toContain('No se puede modificar el ID');
  });

  test('No debería actualizar una transacción inexistente (PATCH /transacciones/:id)', async () => {
    const res = await request(app)
      .patch('/transacciones/663bf3d3c9a364f0b90f0000')
      .send({ nota: 'Test inexistente' });

    expect(res.status).toBe(404);
    expect(res.body.mensaje).toContain('Transacción no encontrada');
  });

  test('Debería eliminar una transacción existente (DELETE /transacciones/:id)', async () => {
    const resCrear = await request(app).post('/transacciones').send({
      clienteId,
      mercaderId,
      bienes: [{ bienId, cantidad: 1 }]
    });

    const id = resCrear.body._id;
    const resDelete = await request(app).delete(`/transacciones/${id}`);

    expect(resDelete.status).toBe(200);
    expect(resDelete.body.mensaje).toContain('eliminada correctamente');
  });

  test('No debería eliminar una transacción inexistente (DELETE /transacciones/:id)', async () => {
    const res = await request(app).delete('/transacciones/663bf3d3c9a364f0b90f0000');

    expect(res.status).toBe(404);
    expect(res.body.mensaje).toContain('no encontrada');
  });
});