import express from 'express';
import { crearMercader, obtenerMercaderPorNombre, obtenerMercaderes , obtenerMercaderPorId, eliminarMercader, actualizarMercader, obtenerMercaderesPorEspecialidad, obtenerMercaderesPorUbicacion} from '../functions/mercader.functions.js';

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
 * Ruta GET para obtener el dinero de un mercader por ID
 * @returns El dinero del mercader o un mensaje de error
 */
mercaderRouter.get('/mercaderes/:id/dinero', async (req, res) => {
  try {
    const { id } = req.params;

    // Obtener el mercader por ID
    const mercader = await obtenerMercaderPorId(id);
    if (!mercader) {
      res.status(404).send({ mensaje: 'Mercader no encontrado.' });
      return;
    }

    // Devolver el dinero del mercader
    res.status(200).send({ mensaje: 'Dinero del mercader obtenido correctamente.', dinero: mercader.dinero });
  } catch (error) {
    res.status(500).send({ mensaje: 'Error al obtener el dinero del mercader.', error });
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


/**
 * Ruta PATCH para actualizar un mercader por nombre
 * @returns El mercader actualizado o un mensaje de error
 */
mercaderRouter.patch('/mercaderes/nombre/:nombre', async (req, res) => {
  try {
    const { nombre } = req.params;
    const updates = req.body;

    if(updates._id || updates.nombre) {
      res.status(400).send({ 
        mensaje: 'No se puede modificar el ID del mercader.' });
      return;
    }

    // Primero encontrar el cliente por nombre
    const mercader = await obtenerMercaderPorNombre(nombre);
    if (!mercader) {
      res.status(404).send({ mensaje: 'Mercader no encontrado.' });
      return;
    }

    const mercaderActualizado = await actualizarMercader(mercader[0]._id as string, updates);

    if(mercaderActualizado) {
      res.status(200).send(mercaderActualizado);
    } else {
      res.status(404).send({ mensaje: 'Mercader no encontrado.' });
    }
  } catch (error) {
    res.status(500).send({ 
      mensaje: 'Error al actualizar el mercader', 
      error: error instanceof Error ? error.message : error
    });
  }
});

/**
 * Ruta GET para obtener mercaderes por ubicación
 * @returns Lista de mercaderes de la ubicación especificada o un mensaje de error
 */
mercaderRouter.get('/mercaderes/ubicacion/:ubicacion', async (req, res) => {
  try {
    const { ubicacion } = req.params;
    const mercaderes = await obtenerMercaderesPorUbicacion(ubicacion);

    if (mercaderes.length > 0) {
      res.status(200).send(mercaderes);
    } else {
      res.status(404).send({ 
        mensaje: `No se encontraron mercaderes en '${ubicacion}'.`,
        sugerencia: 'Ubicaciones válidas: Novigrado, Oxenfurt, Velen, Skellige, Toussaint'
      });
    }
  } catch (error) {
    res.status(500).send({ 
      mensaje: 'Error al buscar mercaderes por ubicación', 
      error: error instanceof Error ? error.message : error 
    });
  }
});


/**
 * Ruta GET para obtener mercaderes por especialidad
 * @returns Lista de mercaderes de la especialidad especificada o un mensaje de error
 */
mercaderRouter.get('/mercaderes/especialidad/:especialidad', async (req, res) => {
  try {
    const { especialidad } = req.params;
    const mercaderes = await obtenerMercaderesPorEspecialidad(especialidad);

    if (mercaderes.length > 0) {
      res.status(200).send(mercaderes);
    } else {
      res.status(404).send({ 
        mensaje: `No se encontraron mercaderes especializados en '${especialidad}'.`,
        sugerencia: 'Especialidades válidas: Armas, Armaduras, Pociones, Ingredientes, Libros, Miscelánea'
      });
    }
  } catch (error) {
    res.status(500).send({ 
      mensaje: 'Error al buscar mercaderes por especialidad', 
      error: error instanceof Error ? error.message : error 
    });
  }
});