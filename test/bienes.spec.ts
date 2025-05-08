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
  // Limpiar la base de datos antes de cada prueba
  await Bien.deleteMany({});
  // Insertar un bien de prueba
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
        .expect(201); //Esto es un expec de super test

      expect(response.body).toMatchObject(nuevoBien);
      expect(response.body._id).toBeDefined();

      // Verificar que se guardó en la base de datos
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
          // Falta descripcion
        })
        .expect(400);

      expect(response.body).toHaveProperty("message");
    });

    // test("debería fallar si el nombre ya existe", async () => {
    //   const response = await request(app)
    //     .post("/bienes")
    //     .send(testBien) // Mismo nombre que el bien de prueba
    //     .expect(500);

    //   expect(response.body).toHaveProperty("message");
    // });
  });

  describe("GET /bienes", () => {
    test("debería obtener todos los bienes", async () => {
      const response = await request(app)
        .get("/bienes")
        .expect(200);

      expect(response.body.length).toBe(1);
      expect(response.body[0].nombre).toBe(testBien.nombre);
    }
);

    // test("debería filtrar por nombre", async () => {
    //   const response = await request(app)
    //     .get("/bienes?nombre=Espada")
    //     .expect(200);

    //   expect(response.body.length).toBe(1);
    //   expect(response.body[0].nombre).toBe(testBien.nombre);
    // });

    test("debería devolver array vacío si no hay coincidencias", async () => {
      const response = await request(app)
        .get("/bienes?nombre=NoExiste")
        .expect(404);

      expect(response.body).toHaveProperty("mensaje");
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
      const idInexistente = "123456789012345678901234"; // ID válido pero no existente
      const response = await request(app)
        .get(`/bienes/${idInexistente}`)
        .expect(404);

      expect(response.body).toHaveProperty("mensaje", "Bien no encontrado");
    });
  });

  describe("GET /bienes/:id/obtener-valor", () => {
    test("debería obtener el valor de un bien", async () => {
      const bien = await Bien.findOne({ nombre: testBien.nombre });
      const response = await request(app)
        .get(`/bienes/${bien?._id}/obtener-valor`)
        .expect(200);

      expect(response.body).toHaveProperty("valor", testBien.valor);
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

      // Verificar en la base de datos
      const bienActualizado = await Bien.findById(bien?._id);
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

  describe("DELETE /bienes/:id", () => {
    test("debería eliminar un bien", async () => {
      const bien = await Bien.findOne({ nombre: testBien.nombre });
      const response = await request(app)
        .delete(`/bienes/${bien?._id}`)
        .expect(200);

      expect(response.body).toHaveProperty("mensaje", "Bien eliminado correctamente");

      // Verificar que se eliminó
      const bienEliminado = await Bien.findById(bien?._id);
      expect(bienEliminado).toBeNull();
    });
  });

  describe("OPTIONS /bienes/ordenar", () => {
    test("debería ordenar bienes por nombre", async () => {
      // Agregar más bienes para probar ordenación
      await new Bien({
        nombre: "Amuleto",
        descripcion: "Protección mágica",
        valor: 200,
        tipo: "otro"
      }).save();

      const response = await request(app)
        .options("/bienes/ordenar")
        .send({ ordenar: "nombre", ascendente: true })
        .expect(200);

      expect(response.body.length).toBe(2);
      expect(response.body[0].nombre).toBe("Amuleto");
      expect(response.body[1].nombre).toBe(testBien.nombre);
    });
  });

  describe("GET /bienes/tipo/:tipo", () => {
    test("debería filtrar bienes por tipo", async () => {
      const response = await request(app)
        .get("/bienes/tipo/arma")
        .expect(200);

      expect(response.body.length).toBe(1);
      expect(response.body[0].tipo).toBe("arma");
    });
  });

  describe("GET /bienes/valor/:valor", () => {
    test("debería filtrar bienes por valor", async () => {
      const response = await request(app)
        .get("/bienes/valor/100")
        .expect(200);

      expect(response.body.length).toBe(1);
      expect(response.body[0].valor).toBe(100);
    });
  });
});