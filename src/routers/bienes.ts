import express from 'express';
import { crearBien, obtenerBienes, obtenerBienPorId, actualizarBien, eliminarBien, obtenerBienPorNombre} from '../functions/bien.functions.js';

export const bienesRouter = express.Router();

// POST - Crear un nuevo bien
bienesRouter.post('/bienes', async (req, res) => {
  try {
    const bien = await crearBien(req.body);
    res.status(201).send(bien);
  } catch (error) {
    res.status(400).send(error);
  }
});

// GET - Obtener bienes (todos o por filtros)
bienesRouter.get('/bienes', async (req, res) => {
  try {
    const { nombre, descripcion } = req.query;

    const filtros: any = {};
    if (nombre) filtros.nombre = nombre.toString();
    if (descripcion) filtros.descripcion = descripcion.toString();

    const bienes = await obtenerBienes(filtros);

    if (bienes.length > 0) {
      res.status(200).send(bienes);
    } else {
      res.status(404).send({ mensaje: 'No se encontraron bienes.' });
    }
  } catch (error) {
    res.status(500).send({ mensaje: 'Error interno del servidor', error });
  }
});

// GET - Obtener un bien por ID
bienesRouter.get('/bienes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const bien = await obtenerBienPorId(id);
    if (bien) {
      res.status(200).send(bien);
    } else {
      res.status(404).send({ mensaje: 'Bien no encontrado' });
    }
  } catch (error) {
    res.status(500).send({ mensaje: 'Error al obtener el bien', error });
  }
});

// PATCH - Actualizar un bien por ID
bienesRouter.patch('/bienes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (updates._id) {
      res.status(400).send({ mensaje: 'No se puede modificar el ID del bien.' });
      return;
    }

    const bienActualizado = await actualizarBien(id, updates);
    if (bienActualizado) {
      res.status(200).send(bienActualizado);
    } else {
      res.status(404).send({ mensaje: 'Bien no encontrado' });
    }
  } catch (error) {
    res.status(500).send({ mensaje: 'Error al actualizar el bien', error });
  }
});

// DELETE - Eliminar un bien por ID
bienesRouter.delete('/bienes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const bienEliminado = await eliminarBien(id);
    if (bienEliminado) {
      res.status(200).send({ mensaje: 'Bien eliminado correctamente' });
    } else {
      res.status(404).send({ mensaje: 'Bien no encontrado' });
    }
  } catch (error) {
    res.status(500).send({ mensaje: 'Error al eliminar el bien', error });
  }
});