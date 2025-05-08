import { describe, test, beforeEach, expect } from "vitest";
import { app } from "../src/app.js";
import request from "supertest";
import { Cliente } from "../src/schemas/cliente.model.js";
import { Bien } from "../src/schemas/bien.model.js";

const testCliente = {
  nombre: "Geralt de Rivia",
  tipo: "Brujo",
  dinero: 500,
  bienes: [],
  historia: "Cazador de monstruos"
};

beforeEach(async () => {
  await Cliente.deleteMany({});
  await Bien.deleteMany({});
  await new Cliente(testCliente).save();
});

describe("API de Clientes", () => {
  describe("POST /clientes", () => {
    test("debería crear un nuevo cliente", async () => {
      const nuevoCliente = {
        nombre: "Yennefer",
        tipo: "Brujo",
        dinero: 1000,
        historia: "Magia poderosa"
      };

      const response = await request(app)
        .post("/clientes")
        .send(nuevoCliente)
        .expect(201);

      expect(response.body).toMatchObject(nuevoCliente);
      expect(response.body._id).toBeDefined();

      const clienteGuardado = await Cliente.findById(response.body._id);
      expect(clienteGuardado).not.toBeNull();
      expect(clienteGuardado?.nombre).toBe(nuevoCliente.nombre);
    });

    test("debería fallar si el nombre no empieza con mayúscula", async () => {
      const response = await request(app)
        .post("/clientes")
        .send({
          nombre: "triss",
          tipo: "Brujo",
          dinero: 800
        })
        .expect(400);

      expect(response.body).toHaveProperty("message");
    });

    test("debería fallar si el dinero es negativo", async () => {
      const response = await request(app)
        .post("/clientes")
        .send({
          nombre: "Ciri",
          tipo: "Cazador",
          dinero: -100
        })
        .expect(400);

      expect(response.body).toHaveProperty("message");
    });
  });

  describe("GET /clientes", () => {
    test("debería obtener todos los clientes", async () => {
      const response = await request(app)
        .get("/clientes")
        .expect(200);

      expect(response.body.length).toBe(1);
      expect(response.body[0].nombre).toBe(testCliente.nombre);
    });

    test("debería devolver 404 si no hay clientes", async () => {
      await Cliente.deleteMany({});
      const response = await request(app)
        .get("/clientes")
        .expect(404);

      expect(response.body).toHaveProperty("mensaje");
    });
  });

  describe("GET /clientes/:id", () => {
    test("debería obtener un cliente por ID", async () => {
      const cliente = await Cliente.findOne({ nombre: testCliente.nombre }).lean();
      const response = await request(app)
        .get(`/clientes/${cliente?._id}`)
        .expect(200);

      expect(response.body._id).toBe(cliente?._id?.toString());
      expect(response.body.nombre).toBe(testCliente.nombre);
    });

    test("debería devolver 404 si el cliente no existe", async () => {
      const idInexistente = "123456789012345678901234";
      const response = await request(app)
        .get(`/clientes/${idInexistente}`)
        .expect(404);

      expect(response.body).toHaveProperty("mensaje", "Cliente no encontrado.");
    });
  });

  describe("PATCH /clientes/:id", () => {
    test("debería actualizar un cliente", async () => {
      const cliente = await Cliente.findOne({ nombre: testCliente.nombre });
      const updates = { dinero: 600 };

      const response = await request(app)
        .patch(`/clientes/${cliente?._id}`)
        .send(updates)
        .expect(200);

      expect(response.body.dinero).toBe(600);

      const clienteActualizado = await Cliente.findById(cliente?._id);
      expect(clienteActualizado?.dinero).toBe(600);
    });

    test("debería rechazar cambiar el ID", async () => {
      const cliente = await Cliente.findOne({ nombre: testCliente.nombre });
      const response = await request(app)
        .patch(`/clientes/${cliente?._id}`)
        .send({ _id: "123456789012345678901234" })
        .expect(400);

      expect(response.body).toHaveProperty("mensaje", "No se puede modificar el ID del cliente.");
    });
  });

  describe("DELETE /clientes/:id", () => {
    test("debería eliminar un cliente", async () => {
      const cliente = await Cliente.findOne({ nombre: testCliente.nombre });
      const response = await request(app)
        .delete(`/clientes/${cliente?._id}`)
        .expect(200);

      expect(response.body).toHaveProperty("mensaje", "Cliente eliminado correctamente.");

      const clienteEliminado = await Cliente.findById(cliente?._id);
      expect(clienteEliminado).toBeNull();
    });
  });
});