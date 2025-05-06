import { describe, test, beforeEach, expect } from "vitest";
import app from '../src/index.js';
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
  // Limpiar las bases de datos antes de cada prueba
  await Cliente.deleteMany({});
  await Bien.deleteMany({});
  
  // Insertar un cliente de prueba
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

      // Verificar en la base de datos
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

    // test("debería filtrar por nombre", async () => {
    //   const response = await request(app)
    //     .get("/clientes?nombre=Geralt")
    //     .expect(200);

    //   expect(response.body.length).toBe(1);
    //   expect(response.body[0].nombre).toBe(testCliente.nombre);
    // });

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

  describe("GET /clientes/:id/dinero", () => {
    test("debería obtener el dinero de un cliente", async () => {
      const cliente = await Cliente.findOne({ nombre: testCliente.nombre });
      const response = await request(app)
        .get(`/clientes/${cliente?._id}/dinero`)
        .expect(200);

      expect(response.body).toHaveProperty("dinero", testCliente.dinero);
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

      // Verificar en la base de datos
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

      // Verificar que se eliminó
      const clienteEliminado = await Cliente.findById(cliente?._id);
      expect(clienteEliminado).toBeNull();
    });
  });

  describe("OPTIONS /clientes/ordenar", () => {
    test("debería ordenar clientes por nombre", async () => {
      // Agregar otro cliente para probar ordenación
      await new Cliente({
        nombre: "Triss Merigold",
        tipo: "Brujo",
        dinero: 700
      }).save();

      const response = await request(app)
        .options("/clientes/ordenar")
        .send({ ordenar: "nombre", ascendente: true })
        .expect(200);

      expect(response.body.length).toBe(2);
      expect(response.body[0].nombre).toBe("Geralt de Rivia");
      expect(response.body[1].nombre).toBe("Triss Merigold");
    });
  });

  describe("GET /clientes/tipo/:tipo", () => {
    test("debería filtrar clientes por tipo", async () => {
      const response = await request(app)
        .get("/clientes/tipo/Brujo")
        .expect(200);

      expect(response.body.length).toBe(1);
      expect(response.body[0].tipo).toBe("Brujo");
    });

    test("debería devolver sugerencia si no hay clientes del tipo", async () => {
      const response = await request(app)
        .get("/clientes/tipo/Aldeano")
        .expect(404);

      expect(response.body).toHaveProperty("sugerencia");
    });
  });

  describe("GET /clientes/dinero/:dinero", () => {
    test("debería filtrar clientes por dinero exacto", async () => {
      const response = await request(app)
        .get("/clientes/dinero/500")
        .expect(200);

      expect(response.body.length).toBe(1);
      expect(response.body[0].dinero).toBe(500);
    });
  });

  describe("Funciones adicionales", () => {
    test("debería añadir un bien a un cliente", async () => {
      const cliente = await Cliente.findOne({ nombre: testCliente.nombre });
      const bien = await new Bien({
        nombre: "Espada de plata",
        descripcion: "Para bestias",
        valor: 300,
        tipo: "arma"
      }).save() as { _id: string };

      const response = await request(app)
        .post(`/clientes/${cliente?._id}/bienes`)
        .send({ bienId: bien._id })
        .expect(201);

      expect(response.body.bienes).toContain((bien._id as string).toString());
    });

    test("debería quitar dinero a un cliente", async () => {
      const cliente = await Cliente.findOne({ nombre: testCliente.nombre });
      const response = await request(app)
        .patch(`/clientes/${cliente?._id}/quitar-dinero`)
        .send({ cantidad: 100 })
        .expect(200);

      expect(response.body.dinero).toBe(400);
    });
  });
});