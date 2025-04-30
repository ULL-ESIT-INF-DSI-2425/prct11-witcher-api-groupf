import express from 'express';
import { crearBien, obtenerBienes, obtenerBienPorId, actualizarBien, eliminarBien } from '../functions/bien.functions.js';

export const bienesRouter = express.Router();

// POST - Crear un nuevo bien
bienesRouter.post('/goods', async (req, res) => {
  try {
    const bien = await crearBien(req.body);
    res.status(201).send(bien);
  } catch (error) {
    res.status(400).send({ mensaje: 'Error al crear el bien', error });
  }
});

// GET - Obtener bienes (todos o por filtros)
bienesRouter.get('/goods', async (req, res) => {
  try {
    const bienes = await obtenerBienes(req.query);
    res.status(200).send(bienes);
  } catch (error) {
    res.status(500).send({ mensaje: 'Error al obtener los bienes', error });
  }
});

// GET - Obtener un bien por ID
bienesRouter.get('/goods/:id', async (req, res) => {
  try {
    const bien = await obtenerBienPorId(req.params.id);
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
bienesRouter.patch('/goods/:id', async (req, res) => {
  try {
    const bienActualizado = await actualizarBien(req.params.id, req.body);
    if (bienActualizado) {
      res.status(200).send(bienActualizado);
    } else {
      res.status(404).send({ mensaje: 'Bien no encontrado' });
    }
  } catch (error) {
    res.status(400).send({ mensaje: 'Error al actualizar el bien', error });
  }
});

// DELETE - Eliminar un bien por ID
bienesRouter.delete('/goods/:id', async (req, res) => {
  try {
    const bienEliminado = await eliminarBien(req.params.id);
    if (bienEliminado) {
      res.status(200).send({ mensaje: 'Bien eliminado correctamente' });
    } else {
      res.status(404).send({ mensaje: 'Bien no encontrado' });
    }
  } catch (error) {
    res.status(500).send({ mensaje: 'Error al eliminar el bien', error });
  }
});