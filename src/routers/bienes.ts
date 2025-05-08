import express from 'express';
import { crearBien, obtenerBienes, obtenerBienPorId, actualizarBien, eliminarBien, obtenerBienPorNombre} from '../functions/bien.functions.js';

/**
 * Router de Express para manejar las operaciones CRUD de bienes.
 */
export const bienesRouter = express.Router();


/**
 * Ruta POST para crear un nuevo bien
 * @returns El bien creado o un mensaje de error
 */
bienesRouter.post('/bienes', async (req, res) => {
  try {
    const bien = await crearBien(req.body);
    res.status(201).send(bien);
  } catch (error) {
    res.status(400).send(error);
  }
});

/**
 * Ruta GET para obtener bienes
 * @returns Lista de bienes o un mensaje de error
 */
bienesRouter.get('/bienes', async (req, res) => {
  try {
    const nombre = req.query.nombre?.toString();

    const bienes = nombre
      ? await obtenerBienPorNombre(nombre)
      : await obtenerBienes();

    if (bienes.length > 0) {
      res.status(200).send(bienes);
    } else {
      res.status(404).send({ mensaje: 'No se encontraron bienes.' });
    }
  } catch (error) {
    res.status(500).send({ mensaje: 'Error interno del servidor', error });
  }
});



/**
 * Ruta GET para obtener un bien por ID
 * @returns El bien encontrado o un mensaje de error
 */
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


/**
 * Ruta PATCH para actualizar un bien por nombre usando query
 * @returns El bien actualizado o un mensaje de error
 */
bienesRouter.patch('/bienes', async (req, res) => {
  try {
    const nombre = req.query.nombre?.toString();
    const updates = req.body;

    if (!nombre) {
      res.status(400).send({ mensaje: 'Se requiere el nombre del bien como query (?nombre=...)' });
      return;
    }

    if (updates._id || updates.nombre) {
      res.status(400).send({ 
        mensaje: 'No se puede modificar el ID o el nombre del bien.' 
      });
      return;
    }

    // Buscar el bien por nombre
    const bienes = await obtenerBienPorNombre(nombre);
    if (bienes.length === 0) {
      res.status(404).send({ mensaje: 'Bien no encontrado' });
      return;
    }

    const bienActualizado = await actualizarBien(bienes[0]._id as string, updates);

    if (bienActualizado) {
      res.status(200).send(bienActualizado);
    } else {
      res.status(404).send({ mensaje: 'Error al actualizar el bien' });
    }
  } catch (error) {
    res.status(500).send({ 
      mensaje: 'Error al actualizar el bien', 
      error: error instanceof Error ? error.message : error 
    });
  }
});

/**
 * Ruta PATCH para actualizar un bien por ID
 * @returns El bien actualizado o un mensaje de error
 */
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

/**
 * Ruta DELETE para eliminar un bien por nombre usando query
 * @returns Mensaje de éxito o error
 */
bienesRouter.delete('/bienes', async (req, res) => {
  try {
    const nombre = req.query.nombre?.toString();

    if (!nombre) {
      res.status(400).send({ mensaje: 'Se requiere el nombre del bien como query (?nombre=...)' });
      return;
    }

    // Buscar el bien por nombre
    const bienes = await obtenerBienPorNombre(nombre);
    if (bienes.length === 0) {
      res.status(404).send({ mensaje: 'Bien no encontrado' });
      return;
    }

    // Eliminar el primer bien encontrado con ese nombre
    const bienEliminado = await eliminarBien(bienes[0]._id as string);

    if (bienEliminado) {
      res.status(200).send({ mensaje: 'Bien eliminado correctamente' });
    } else {
      res.status(500).send({ mensaje: 'Error al eliminar el bien' });
    }
  } catch (error) {
    res.status(500).send({ mensaje: 'Error al eliminar el bien', error });
  }
});


/**
 * Ruta DELETE para eliminar un bien por ID
 * @returns Mensaje de éxito o error
 */
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




