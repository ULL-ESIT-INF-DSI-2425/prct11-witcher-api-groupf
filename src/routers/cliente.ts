import express from 'express';
import { crearCliente, obtenerClientePorNombre, obtenerClientes , obtenerClientePorId, eliminarCliente, actualizarCliente} from '../functions/cliente.functions.js';
import { ClienteDocumentInterface } from '../schemas/cliente.model.js';

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


// GET - Obtener el dinero de un cliente por ID
clienteRouter.get('/clientes/:id/dinero', async (req, res) => {
  try {
    const { id } = req.params;

    // Obtener el cliente por ID
    const cliente = await obtenerClientePorId(id);
    if (!cliente) {
      res.status(404).send({ mensaje: 'Cliente no encontrado.' });
      return;
    }

    // Enviar el dinero del cliente
    res.status(200).send({ dinero: cliente.dinero });
  }
  catch (error) {
    res.status(500).send({ mensaje: 'Error al obtener el dinero del cliente', error });
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

// PATCH - Actualizar un cliente por ID
clienteRouter.patch('/clientes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    if(updates._id) {
      res.status(400).send({ mensaje: 'No se puede modificar el ID del cliente.' });
      return;
    }

    const clienteActualizado = await actualizarCliente(id, updates);

    if(clienteActualizado) {
      res.status(200).send(clienteActualizado);
    } else {
      res.status(404).send({ mensaje: 'Cliente no encontrado.' });
    }
  } catch (error) {
    res.status(500).send({ mensaje: 'Error al actualizar el cliente', error });
  }
});



// DELETE - Eliminar un cliente por ID
clienteRouter.delete('/clientes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const cliente = await eliminarCliente(id);

    if (cliente) {
      res.status(200).send({ mensaje: 'Cliente eliminado correctamente.' });
    } else {
      res.status(404).send({ mensaje: 'Cliente no encontrado.' });
    }
  } catch (error) {
    res.status(500).send({ mensaje: 'Error al eliminar el cliente', error });
  }
});

// OPTIONS - Ordenar clientes
clienteRouter.options('/clientes/ordenar', async (req, res) => {
  try {
    const { ordenar, ascendente } = req.body;

    // Validar que los parámetros necesarios estén presentes
    if (!ordenar || typeof ascendente === 'undefined') {
      res.status(400).send({ mensaje: 'Se requieren los campos "ordenar" y "ascendente".' });
      return;
    }

    const orden = ascendente ? 1 : -1; // 1 para ascendente, -1 para descendente
    const clientes = await obtenerClientes();

    // Verificar si hay clientes
    if (clientes.length === 0) {
      res.status(404).send({ mensaje: 'No se encontraron clientes.' });
      return;
    }

    // Verificar que el campo "ordenar" sea válido
    if (!(ordenar in clientes[0])) {
      res.status(400).send({ mensaje: `El campo "${ordenar}" no es válido para ordenar.` });
      return;
    }

    // Ordenar los clientes según el campo y el orden especificado
    const clientesOrdenados = clientes.sort((a, b) => {
      const valorA = a.nombre.toLowerCase();
      const valorB = b.nombre.toLowerCase();
      return ascendente ? valorA.localeCompare(valorB) : valorB.localeCompare(valorA);
    });

    // Enviar los clientes ordenados
    res.status(200).send(clientesOrdenados);
  } catch (error) {
    res.status(500).send({ mensaje: 'Error al ordenar los clientes.', error });
  }
});




