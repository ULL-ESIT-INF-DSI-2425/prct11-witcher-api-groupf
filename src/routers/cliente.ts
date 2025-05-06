import express from 'express';
import { crearCliente, obtenerClientePorNombre, obtenerClientes , obtenerClientePorId, eliminarCliente, actualizarCliente, obtenerClientesPorDinero, obtenerClientesPorTipo} from '../functions/cliente.functions.js';


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

// GET - Obtener clientes por tipo
clienteRouter.get('/clientes/tipo/:tipo', async (req, res) => {
  try {
    const { tipo } = req.params;
    const clientes = await obtenerClientesPorTipo(tipo);

    if (clientes.length > 0) {
      res.status(200).send(clientes);
    } else {
      res.status(404).send({ 
        mensaje: `No se encontraron clientes del tipo '${tipo}'.`,
        sugerencia: 'Los tipos válidos son: Cazador, Brujo, Noble, Bandido, Mercenario, Aldeano'
      });
    }
  } catch (error) {
    res.status(500).send({ 
      mensaje: 'Error al buscar clientes por tipo', 
      error: error instanceof Error ? error.message : error 
    });
  }
});

// GET - Obtener clientes por dinero exacto
clienteRouter.get('/clientes/dinero/:dinero', async (req, res) => {
  try {
    const { dinero } = req.params;
    const dineroNumerico = parseFloat(dinero);
    const clientes = await obtenerClientesPorDinero(dineroNumerico);

    if (clientes.length > 0) {
      res.status(200).send(clientes);
    } else {
      res.status(404).send({ mensaje: 'No se encontraron clientes con esa cantidad exacta de dinero.' });
    }
  } catch (error) {
    res.status(500).send({ mensaje: 'Error al buscar clientes por dinero', error });
  }
});
