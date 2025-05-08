import express from 'express';
import { crearMercader, obtenerMercaderPorNombre, obtenerMercaderes , obtenerMercaderPorId, eliminarMercader, actualizarMercader} from '../functions/mercader.functions.js';

/**
 * Router de Express para manejar las operaciones CRUD de mercaderes.
 */
export const mercaderRouter = express.Router();

/**
 * Ruta POST para crear un nuevo mercader
 * @returns El mercader creado o un mensaje de error
 */
mercaderRouter.post('/mercaderes', async (req, res) => {
  try {
    const mercader = await crearMercader(req.body);
    res.status(201).send(mercader);
  } catch (error) {
    res.status(400).send(error);
  }
});


/**
 * Ruta GET para obtener mercaderes
 * @returns Lista de mercaderes o un mensaje de error
 */
mercaderRouter.get('/mercaderes', async (req, res) => {
  try {
    const nombre = req.query.nombre?.toString();

    const mercaderes = nombre
      ? await obtenerMercaderPorNombre(nombre)
      : await obtenerMercaderes();

    if (mercaderes.length > 0) {
      res.status(200).send(mercaderes);
    } else {
      res.status(404).send({ mensaje: 'No se encontraron mercaderes.' });
    }
  } catch (error) {
    res.status(500).send({ mensaje: 'Error interno del servidor', error });
  }
});


/**
 * Ruta GET para obtener un mercader por ID
 * @returns El mercader encontrado o un mensaje de error
 */
mercaderRouter.get('/mercaderes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const mercader = await obtenerMercaderPorId(id);

    if (mercader) {
      res.status(200).send(mercader);
    } else {
      res.status(404).send({ mensaje: 'Mercader no encontrado.' });
    }
  } catch (error) {
    res.status(500).send({ mensaje: 'Error al buscar el mercader por ID', error });
  }
});


/**
 * Ruta PATCH para actualizar un mercader por ID (uusando query)
 * @returns El mercader actualizado o un mensaje de error
 */
mercaderRouter.patch('/mercaderes', async (req, res) => {
  try {

    const nombre = req.query.nombre?.toString();
    if (!nombre) {
      res.status(400).send({ mensaje: 'Se requiere el nombre del mercader como query.' });
      return;
    }

    // Buscar el mercader por nombre
    const mercaderes = await obtenerMercaderPorNombre(nombre);
    if (mercaderes.length === 0) {
      res.status(404).send({ mensaje: 'Mercader no encontrado.' });
      return;
    }

    const mercader = mercaderes[0]; // suponemos que el nombre es único
    // Obtener el ID del mercader encontrado
    const id = mercader._id as string;
    const updates = req.body;
    
    if (updates._id) {
      res.status(400).send({ mensaje: 'No se puede modificar el ID del mercader.' });
      return;
    }

    const mercaderActualizado = await actualizarMercader(id, updates);

    if (mercaderActualizado) {
      res.status(200).send(mercaderActualizado);
    } else {
      res.status(404).send({ mensaje: 'Mercader no encontrado.' });
    }
  } catch (error) {
    res.status(400).send({ mensaje: 'Error al actualizar el mercader', error });
  }
});



/**
 * Ruta PATCH para actualizar un mercader por ID
 * @returns El mercader actualizado o un mensaje de error
 */
mercaderRouter.patch('/mercaderes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    if (updates._id) {
      res.status(400).send({ mensaje: 'No se puede modificar el ID del mercader.' });
      return;
    }

    const mercaderActualizado = await actualizarMercader(id, updates);

    if (mercaderActualizado) {
      res.status(200).send(mercaderActualizado);
    } else {
      res.status(404).send({ mensaje: 'Mercader no encontrado.' });
    }
  } catch (error) {
    res.status(400).send({ mensaje: 'Error al actualizar el mercader', error });
  }
});

/**
 * Ruta DELETE para eliminar un mercader por nombre (usando query)
 * @returns Mensaje de éxito o error
 */
mercaderRouter.delete('/mercaderes', async (req, res) => {
  try {
    const nombre = req.query.nombre?.toString();

    if (!nombre) {
      res.status(400).send({ mensaje: 'Se requiere el nombre del mercader como query.' });
      return;
    }

    // Buscar el mercader por nombre
    const mercaderes = await obtenerMercaderPorNombre(nombre);

    if (mercaderes.length === 0) {
      res.status(404).send({ mensaje: 'Mercader no encontrado.' });
      return;
    }
    // Obtener el ID del mercader encontrado
    const id = mercaderes[0]._id as string;
    const mercaderEliminado = await eliminarMercader(id);

    if (mercaderEliminado) {
      res.status(200).send({ mensaje: 'Mercader eliminado correctamente.', mercader: mercaderEliminado });
    } else {
      res.status(404).send({ mensaje: 'No se pudo eliminar el mercader.' });
    }
  } catch (error) {
    res.status(500).send({ mensaje: 'Error al eliminar el mercader', error });
  }
});


/**
 * Ruta DELETE para eliminar un mercader por ID
 * @returns Mensaje de éxito o error
 */
mercaderRouter.delete('/mercaderes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const mercaderEliminado = await eliminarMercader(id);

    if (mercaderEliminado) {
      res.status(200).send({ mensaje: 'Mercader eliminado correctamente.', mercader: mercaderEliminado });
    } else {
      res.status(404).send({ mensaje: 'Mercader no encontrado.' });
    }
  } catch (error) {
    res.status(500).send({ mensaje: 'Error al eliminar el mercader', error });
  }
});

