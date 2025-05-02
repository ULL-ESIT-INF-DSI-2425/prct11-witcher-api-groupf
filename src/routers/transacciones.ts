import express from 'express';
import { crearTransaccionCompleta, obtenerTransaccion, obtenerTransaccionPorId, obtenerTransaccionPorNombre } from '../functions/transaccion.functions.js';

export const transaccionRouter = express.Router();

transaccionRouter.post('/transacciones', async (req, res) => {
  try {
    const transaccion = await crearTransaccionCompleta(req.body);
    res.status(201).send(transaccion);
  } catch (error) {
    console.error('Error en transacción:', error);
    res.status(400).send({ mensaje: (error as Error).message });
  }
});


// GET - Obtener mercaderes (todos o por nombre)
transaccionRouter.get('/transacciones', async (req, res) => {
  try {
    const nombre = req.query.nombre?.toString();

    const mercaderes = nombre
      ? await obtenerTransaccionPorNombre(nombre)
      : await obtenerTransaccion();

    if (mercaderes.length > 0) {
      res.status(200).send(mercaderes);
    } else {
      res.status(404).send({ mensaje: 'No se encontraron trnasacciones.' });
    }
  } catch (error) {
    res.status(500).send({ mensaje: 'Error interno del servidor', error });
  }
});


// GET - Obtener un mercader por ID
transaccionRouter.get('/transacciones/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const mercader = await obtenerTransaccionPorId(id);

    if (mercader) {
      res.status(200).send(mercader);
    } else {
      res.status(404).send({ mensaje: 'Mercader no encontrado.' });
    }
  } catch (error) {
    res.status(500).send({ mensaje: 'Error al buscar el mercader por ID', error });
  }
});