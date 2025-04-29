import express from 'express';
import { crearCliente, obtenerClientePorNombre, obtenerClientes , obtenerClientePorId} from '../functions/cliente.functions.js';

export const clienteRouter = express.Router();

// POST - Crear nuevo cliente
clienteRouter.post('/clientes', async (req, res) => {
  try {
    const cliente = await crearCliente(req.body);
    res.status(201).send(cliente);
  } catch (error) {
    res.status(400).send(error);
  }
});


// GET - Obtener clientes (todos o por nombre)
clienteRouter.get('/clientes', async (req, res) => {
  try {
    const nombre = req.query.nombre?.toString();

    const clientes = nombre
      ? await obtenerClientePorNombre(nombre)
      : await obtenerClientes();

    if (clientes.length > 0) {
      res.status(200).send(clientes);
    } else {
      res.status(404).send({ mensaje: 'No se encontraron clientes.' });
    }
  } catch (error) {
    res.status(500).send({ mensaje: 'Error interno del servidor', error });
  }
});


// GET - Obtener un cliente por ID
clienteRouter.get('/clientes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const cliente = await obtenerClientePorId(id);

    if (cliente) {
      res.status(200).send(cliente);
    } else {
      res.status(404).send({ mensaje: 'Cliente no encontrado.' });
    }
  } catch (error) {
    res.status(500).send({ mensaje: 'Error al buscar el cliente por ID', error });
  }
});
