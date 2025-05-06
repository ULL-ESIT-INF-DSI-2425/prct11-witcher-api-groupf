
import { describe, test, beforeEach, expect } from "vitest";
import app from '../src/index.js';
import request from "supertest";
import { Mercader } from "../src/schemas/mercader.model.js";
import { Bien } from "../src/schemas/bien.model.js";

const testMercader = {
  nombre: "Marcus Tober",
  tienda: "El Caldero Chispeante",
  ubicacion: "Novigrado",
  especialidad: "Pociones",
  reputacion: 4,
  dinero: 1500,
  inventario: []
};

const testBien = {
  nombre: "Poción de salud",
  descripcion: "Restaura vitalidad",
  valor: 50,
  tipo: "pocion"
};

beforeEach(async () => {
  // Limpiar las bases de datos antes de cada prueba
  await Mercader.deleteMany({});
  await Bien.deleteMany({});
  
  // Insertar datos de prueba
  await new Mercader(testMercader).save();
  await new Bien(testBien).save();
});

describe("API de Mercaderes", () => {
  describe("POST /mercaderes", () => {
    test("debería crear un nuevo mercader", async () => {
      const nuevoMercader = {
        nombre: "Hattori",
        tienda: "Armería de Hattori",
        ubicacion: "Novigrado",
        especialidad: "Armas",
        reputacion: 5,
        dinero: 2000
      };

      const response = await request(app)
        .post("/mercaderes")
        .send(nuevoMercader)
        .expect(201);

      expect(response.body).toMatchObject(nuevoMercader);
      expect(response.body._id).toBeDefined();

      // Verificar en la base de datos
      const mercaderGuardado = await Mercader.findById(response.body._id);
      expect(mercaderGuardado).not.toBeNull();
      expect(mercaderGuardado?.nombre).toBe(nuevoMercader.nombre);
    });

    test("debería fallar si el nombre no empieza con mayúscula", async () => {
      const response = await request(app)
        .post("/mercaderes")
        .send({
          nombre: "pepe",
          tienda: "Tienda Pepe",
          ubicacion: "Oxenfurt",
          especialidad: "Miscelánea",
          reputacion: 3,
          dinero: 500
        })
        .expect(400);

      expect(response.body).toHaveProperty("message");
    });

    test("debería fallar si la reputación es menor a 1", async () => {
      const response = await request(app)
        .post("/mercaderes")
        .send({
          nombre: "Olivier",
          tienda: "Posada de Olivier",
          ubicacion: "Velen",
          especialidad: "Ingredientes",
          reputacion: 0,
          dinero: 300
        })
        .expect(400);

      expect(response.body).toHaveProperty("message");
    });
  });

  describe("GET /mercaderes", () => {
    test("debería obtener todos los mercaderes", async () => {
      const response = await request(app)
        .get("/mercaderes")
        .expect(200);

      expect(response.body.length).toBe(1);
      expect(response.body[0].nombre).toBe(testMercader.nombre);
    });

    // test("debería filtrar por nombre", async () => {
    //   const response = await request(app)
    //     .get("/mercaderes?nombre=Marcus")
    //     .expect(200);

    //   expect(response.body.length).toBe(1);
    //   expect(response.body[0].nombre).toBe(testMercader.nombre);
    // });

    test("debería devolver 404 si no hay mercaderes", async () => {
      await Mercader.deleteMany({});
      const response = await request(app)
        .get("/mercaderes")
        .expect(404);

      expect(response.body).toHaveProperty("mensaje");
    });
  });

  describe("GET /mercaderes/:id", () => {
    test("debería obtener un mercader por ID", async () => {
      const mercader = await Mercader.findOne({ nombre: testMercader.nombre }).lean();
      const response = await request(app)
        .get(`/mercaderes/${mercader?._id}`)
        .expect(200);

      expect(response.body._id).toBe(mercader?._id.toString());
      expect(response.body.nombre).toBe(testMercader.nombre);
    });

    test("debería devolver 404 si el mercader no existe", async () => {
      const idInexistente = "123456789012345678901234";
      const response = await request(app)
        .get(`/mercaderes/${idInexistente}`)
        .expect(404);

      expect(response.body).toHaveProperty("mensaje", "Mercader no encontrado.");
    });
  });

  describe("GET /mercaderes/:id/dinero", () => {
    test("debería obtener el dinero de un mercader", async () => {
      const mercader = await Mercader.findOne({ nombre: testMercader.nombre });
      const response = await request(app)
        .get(`/mercaderes/${mercader?._id}/dinero`)
        .expect(200);

      expect(response.body).toHaveProperty("dinero", testMercader.dinero);
    });
  });

  describe("PATCH /mercaderes/:id", () => {
    test("debería actualizar un mercader", async () => {
      const mercader = await Mercader.findOne({ nombre: testMercader.nombre });
      const updates = { reputacion: 5 };

      const response = await request(app)
        .patch(`/mercaderes/${mercader?._id}`)
        .send(updates)
        .expect(200);

      expect(response.body.reputacion).toBe(5);

      // Verificar en la base de datos
      const mercaderActualizado = await Mercader.findById(mercader?._id);
      expect(mercaderActualizado?.reputacion).toBe(5);
    });

    test("debería rechazar cambiar el ID", async () => {
      const mercader = await Mercader.findOne({ nombre: testMercader.nombre });
      const response = await request(app)
        .patch(`/mercaderes/${mercader?._id}`)
        .send({ _id: "123456789012345678901234" })
        .expect(400);

      expect(response.body).toHaveProperty("mensaje", "No se puede modificar el ID del mercader.");
    });
  });

  describe("DELETE /mercaderes/:id", () => {
    test("debería eliminar un mercader", async () => {
      const mercader = await Mercader.findOne({ nombre: testMercader.nombre });
      const response = await request(app)
        .delete(`/mercaderes/${mercader?._id}`)
        .expect(200);

      expect(response.body).toHaveProperty("mensaje", "Mercader eliminado correctamente.");

      // Verificar que se eliminó
      const mercaderEliminado = await Mercader.findById(mercader?._id);
      expect(mercaderEliminado).toBeNull();
    });
  });

  describe("OPTIONS /mercaderes/ordenar", () => {
    test("debería ordenar mercaderes por reputación descendente", async () => {
      // Agregar otro mercader para probar ordenación
      await new Mercader({
        nombre: "Fergus Graem",
        tienda: "Herrería de Crow's Perch",
        ubicacion: "Velen",
        especialidad: "Armas",
        reputacion: 3,
        dinero: 800
      }).save();

      const response = await request(app)
        .options("/mercaderes/ordenar")
        .send({ ordenar: "reputacion", ascendente: false })
        .expect(200);

      expect(response.body.length).toBe(2);
      expect(response.body[0].reputacion).toBe(4);
      expect(response.body[1].reputacion).toBe(3);
    });
  });

  describe("GET /mercaderes/ubicacion/:ubicacion", () => {
    test("debería filtrar mercaderes por ubicación", async () => {
      const response = await request(app)
        .get("/mercaderes/ubicacion/Novigrado")
        .expect(200);

      expect(response.body.length).toBe(1);
      expect(response.body[0].ubicacion).toBe("Novigrado");
    });

    test("debería devolver sugerencia si no hay mercaderes en la ubicación", async () => {
      const response = await request(app)
        .get("/mercaderes/ubicacion/Toussaint")
        .expect(404);

      expect(response.body).toHaveProperty("sugerencia");
    });
  });

  describe("GET /mercaderes/especialidad/:especialidad", () => {
    test("debería filtrar mercaderes por especialidad", async () => {
      const response = await request(app)
        .get("/mercaderes/especialidad/Pociones")
        .expect(200);

      expect(response.body.length).toBe(1);
      expect(response.body[0].especialidad).toBe("Pociones");
    });
  });

  describe("Funciones adicionales", () => {
    test("debería añadir un bien al inventario de un mercader", async () => {
      const mercader = await Mercader.findOne({ nombre: testMercader.nombre });
      const bien = await Bien.findOne({ nombre: testBien.nombre }) as { _id: string };
      
      const response = await request(app)
        .post(`/mercaderes/${mercader?._id}/inventario`)
        .send({ bienId: bien?._id })
        .expect(201);

      expect(response.body.inventario).toContain(bien?._id.toString());
    });

    test("debería añadir dinero a un mercader", async () => {
      const mercader = await Mercader.findOne({ nombre: testMercader.nombre });
      const response = await request(app)
        .patch(`/mercaderes/${mercader?._id}/dinero`)
        .send({ cantidad: 500 })
        .expect(200);

      expect(response.body.dinero).toBe(2000);
    });

    test("debería verificar si un mercader tiene ciertos bienes", async () => {
      const mercader = await Mercader.findOne({ nombre: testMercader.nombre });
      const bien = await Bien.findOne({ nombre: testBien.nombre });
      
      // Añadir el bien al inventario primero
      await request(app)
        .post(`/mercaderes/${mercader?._id}/inventario`)
        .send({ bienId: bien?._id });

      const response = await request(app)
        .get(`/mercaderes/${mercader?._id}/tiene-bienes`)
        .send({ bienesIds: [bien?._id] })
        .expect(200);

      expect(response.body).toHaveProperty("tieneTodos", true);
    });
  });
});