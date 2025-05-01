import express from 'express';
import {
  crearTransaccion,
  obtenerTransacciones,
  eliminarTransaccion,
} from '../functions/transaccion.functions.js';

export const transaccionRouter = express.Router();

// POST - Crear una nueva transacción
transaccionRouter.post('/transacciones', async (req, res) => {
  try {
    const transaccion = await crearTransaccion(req.body);
    res.status(201).send(transaccion);
  } catch (error) {
    res.status(400).send({ mensaje: 'Error al crear la transacción', error });
  }
});

// GET - Obtener transacciones por filtros
transaccionRouter.get('/transacciones', async (req, res) => {
  try {
    const { cazadorId, mercaderId, fechaInicio, fechaFin } = req.query;
    const transacciones = await obtenerTransacciones({
      cazadorId: cazadorId?.toString(),
      mercaderId: mercaderId?.toString(),
      fechaInicio: fechaInicio ? new Date(fechaInicio.toString()) : undefined,
      fechaFin: fechaFin ? new Date(fechaFin.toString()) : undefined,
    });
    res.status(200).send(transacciones);
  } catch (error) {
    res.status(500).send({ mensaje: 'Error al obtener transacciones', error });
  }
});

// DELETE - Eliminar una transacción por ID
transaccionRouter.delete('/transacciones/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const transaccion = await eliminarTransaccion(id);

    if (transaccion) {
      res.status(200).send({ mensaje: 'Transacción eliminada correctamente.' });
    } else {
      res.status(404).send({ mensaje: 'Transacción no encontrada.' });
    }
  } catch (error) {
    res.status(500).send({ mensaje: 'Error al eliminar la transacción', error });
  }
});