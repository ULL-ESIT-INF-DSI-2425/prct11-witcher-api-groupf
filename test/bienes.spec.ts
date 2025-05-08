import { app } from "../src/app.js";
import { describe, test, beforeEach, expect } from "vitest";
import request from "supertest";
import { Bien } from "../src/schemas/bien.model.js";

const testBien = {
  nombre: "Espada de prueba",
  descripcion: "Una espada muy afilada",
  valor: 100,
  tipo: "arma"
};

beforeEach(async () => {
  await Bien.deleteMany({});
  await new Bien(testBien).save();
});

describe("API de Bienes", () => {
  describe("POST /bienes", () => {
    test("debería crear un nuevo bien", async () => {
      const nuevoBien = {
        nombre: "Escudo de prueba",
        descripcion: "Un escudo resistente",
        valor: 80,
        tipo: "armadura"
      };

      const response = await request(app)
        .post("/bienes")
        .send(nuevoBien)
        .expect(201);

      expect(response.body).toMatchObject(nuevoBien);
      expect(response.body._id).toBeDefined();

      const bienGuardado = await Bien.findById(response.body._id);
      expect(bienGuardado).not.toBeNull();
      expect(bienGuardado?.nombre).toBe(nuevoBien.nombre);
    });

    test("debería fallar si falta un campo requerido", async () => {
      const response = await request(app)
        .post("/bienes")
        .send({
          nombre: "Bien incompleto",
          valor: 100,
          tipo: "arma"
        })
        .expect(400);

      expect(response.body).toHaveProperty("message");
    });
  });

  describe("GET /bienes", () => {
    test("debería obtener todos los bienes", async () => {
      const response = await request(app)
        .get("/bienes")
        .expect(200);

      expect(response.body.length).toBe(1);
      expect(response.body[0].nombre).toBe(testBien.nombre);
    });

    test("debería filtrar por nombre", async () => {
      const response = await request(app)
        .get("/bienes?nombre=Espada de prueba")
        .expect(200);
    
      expect(response.body.length).toBe(1);
      expect(response.body[0].nombre).toBe(testBien.nombre);
    });

    test("debería devolver mensaje si no hay coincidencias", async () => {
      const response = await request(app)
        .get("/bienes?nombre=NoExiste")
        .expect(404);

      expect(response.body).toHaveProperty("mensaje", "No se encontraron bienes.");
    });
  });

  describe("GET /bienes/:id", () => {
    test("debería obtener un bien por ID", async () => {
      const bien = await Bien.findOne({ nombre: testBien.nombre }).lean();
      const response = await request(app)
        .get(`/bienes/${bien?._id}`)
        .expect(200);

      expect(response.body._id).toBe(bien?._id.toString());
      expect(response.body.nombre).toBe(testBien.nombre);
    });

    test("debería devolver 404 si el bien no existe", async () => {
      const idInexistente = "123456789012345678901234";
      const response = await request(app)
        .get(`/bienes/${idInexistente}`)
        .expect(404);

      expect(response.body).toHaveProperty("mensaje", "Bien no encontrado");
    });
  });

  describe("PATCH /bienes/:id", () => {
    test("debería actualizar un bien", async () => {
      const bien = await Bien.findOne({ nombre: testBien.nombre });
      const updates = { valor: 150 };

      const response = await request(app)
        .patch(`/bienes/${bien?._id}`)
        .send(updates)
        .expect(200);

      expect(response.body.valor).toBe(150);

      const bienActualizado       
      = await Bien.findById(bien?._id);
      expect(bienActualizado?.valor).toBe(150);
    });

    test("debería rechazar cambiar el ID", async () => {
      const bien = await Bien.findOne({ nombre: testBien.nombre });
      const response = await request(app)
        .patch(`/bienes/${bien?._id}`)
        .send({ _id: "123456789012345678901234" })
        .expect(400);

      expect(response.body).toHaveProperty("mensaje", "No se puede modificar el ID del bien.");
    });
  });

  describe("PATCH /bienes (por nombre)", () => {
    test("debería actualizar un bien buscado por nombre", async () => {
      const updates = { valor: 200 };

      const response = await request(app)
        .patch("/bienes?nombre=Espada de prueba")
        .send(updates)
        .expect(200);

      expect(response.body.valor).toBe(200);

      const bienActualizado = await Bien.findOne({ nombre: testBien.nombre });
      expect(bienActualizado?.valor).toBe(200);
    });

    test("debería rechazar cambiar el nombre si se usa PATCH por nombre", async () => {
      const response = await request(app)
        .patch("/bienes?nombre=Espada de prueba")
        .send({ nombre: "Nuevo nombre" })
        .expect(400);

      expect(response.body).toHaveProperty("mensaje", "No se puede modificar el ID o el nombre del bien.");
    });
  });

  describe("DELETE /bienes/:id", () => {
    test("debería eliminar un bien", async () => {
      const bien = await Bien.findOne({ nombre: testBien.nombre });
      const response = await request(app)
        .delete(`/bienes/${bien?._id}`)
        .expect(200);

      expect(response.body).toHaveProperty("mensaje", "Bien eliminado correctamente");

      const bienEliminado = await Bien.findById(bien?._id);
      expect(bienEliminado).toBeNull();
    });
  });

  describe("DELETE /bienes (por nombre)", () => {
    test("debería eliminar un bien buscado por nombre", async () => {
      const response = await request(app)
        .delete("/bienes?nombre=Espada de prueba")
        .expect(200);

      expect(response.body).toHaveProperty("mensaje", "Bien eliminado correctamente");

      const bienEliminado = await Bien.findOne({ nombre: testBien.nombre });
      expect(bienEliminado).toBeNull();
    });
  });
});