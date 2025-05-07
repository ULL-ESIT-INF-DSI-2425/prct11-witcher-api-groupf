import express from 'express';
import { crearMercader, obtenerMercaderPorNombre, obtenerMercaderes , obtenerMercaderPorId, eliminarMercader, actualizarMercader, obtenerMercaderesPorEspecialidad, obtenerMercaderesPorUbicacion} from '../functions/mercader.functions.js';


export const mercaderRouter = express.Router();

// POST - Crear nuevo mercader
mercaderRouter.post('/mercaderes', async (req, res) => {
  try {
    const mercader = await crearMercader(req.body);
    res.status(201).send(mercader);
  } catch (error) {
    res.status(400).send(error);
  }
});


// GET - Obtener mercaderes (todos o por nombre)
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


// GET - Obtener un mercader por ID
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


// GET - Obtener el dinero de un mercader por ID
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


// PATCH - Actualizar un mercader por ID
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


// DELETE - Eliminar un mercader por ID
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


// PATCH - Actualizar un mercader por nombre
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

// GET - Obtener mercaderes por ubicación
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

// GET - Obtener mercaderes por especialidad
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