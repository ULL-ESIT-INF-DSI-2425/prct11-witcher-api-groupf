import express from 'express';
import { crearMercader, obtenerMercaderPorNombre, obtenerMercaderes , obtenerMercaderPorId, eliminarMercader, actualizarMercader} from '../functions/mercader.functions.js';
import { MercaderDocumentInterface } from '../schemas/mercader.model.js';

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


// OPTIONS - Buscar y ordenar mercaderes según criterios
mercaderRouter.options('/mercaderes/ordenar', async (req, res) => {
  try {
    const { ordenar, ascendente } = req.body;

    // Validar que los parámetros necesarios estén presentes
    if (!ordenar || typeof ascendente === 'undefined') {
      res.status(400).send({ mensaje: 'Se requieren los campos "ordenar" y "ascendente".' });
      return;
    }

    const orden = ascendente ? 1 : -1; // 1 para ascendente, -1 para descendente
    const mercaderes = await obtenerMercaderes();

    // Verificar si hay mercaderes
    if (mercaderes.length === 0) {
      res.status(404).send({ mensaje: 'No se encontraron mercaderes.' });
      return;
    }

    // Verificar que el campo "ordenar" sea válido
    if (!(ordenar in mercaderes[0])) {
      res.status(400).send({ mensaje: `El campo "${ordenar}" no es válido para ordenar.` });
      return;
    }

    // Ordenar los mercaderes según el campo y el orden especificado
    const mercaderesOrdenados = mercaderes.sort((a, b) => {
      const valorA = a[ordenar as keyof MercaderDocumentInterface];
      const valorB = b[ordenar as keyof MercaderDocumentInterface];

      if (valorA < valorB) return -orden;
      if (valorA > valorB) return orden;
      return 0;
    });

    // Enviar los mercaderes ordenados
    res.status(200).send(mercaderesOrdenados);
  } catch (error) {
    res.status(500).send({ mensaje: 'Error al ordenar los mercaderes.', error });
  }
});

