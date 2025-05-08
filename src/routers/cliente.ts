import express from 'express';
import { crearCliente, obtenerClientePorNombre, obtenerClientes , obtenerClientePorId, eliminarCliente, actualizarCliente, obtenerClientesPorDinero, obtenerClientesPorTipo} from '../functions/cliente.functions.js';

/**
 * Router de Express para manejar las operaciones CRUD de clientes.
 */
export const clienteRouter = express.Router();

/**
 * Ruta POST para crear un nuevo cliente
 * @returns El cliente creado o un mensaje de error
 */
clienteRouter.post('/clientes', async (req, res) => {
  try {
    const cliente = await crearCliente(req.body);
    res.status(201).send(cliente);
  } catch (error) {
    res.status(400).send(error);
  }
});

/**
 * Ruta GET para obtener clientes
 * @returns Lista de clientes o un mensaje de error
 */
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



/**
 * Ruta GET para obtener un cliente por ID
 * @returns El cliente o un mensaje de error
 */
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

/**
 * Ruta PATCH para actualizar un cliente por ID
 * @returns El cliente actualizado o un mensaje de error
 */
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

/**
 * Ruta DELETE para eliminar un cliente por ID
 * @returns Mensaje de éxito o error
 */
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


/**
 * Ruta PATCH para actualizar un cliente por nombre usando query
 * @returns El cliente actualizado o un mensaje de error
 */
clienteRouter.patch('/clientes', async (req, res) => {
  try {
    const nombre = req.query.nombre?.toString();
    const updates = req.body;

    if (!nombre) {
      res.status(400).send({ mensaje: 'Se requiere el nombre del cliente como query (?nombre=...)' });
      return;
    }

    if (updates._id || updates.nombre) {
      res.status(400).send({ mensaje: 'No se puede modificar el ID o el nombre del cliente.' });
      return;
    }

    // Buscar el cliente por nombre
    const clientes = await obtenerClientePorNombre(nombre);
    if (clientes.length === 0) {
      res.status(404).send({ mensaje: 'Cliente no encontrado.' });
      return;
    }

    const clienteActualizado = await actualizarCliente(clientes[0]._id as string, updates);

    if (clienteActualizado) {
      res.status(200).send(clienteActualizado);
    } else {
      res.status(404).send({ mensaje: 'Error al actualizar el cliente.' });
    }
  } catch (error) {
    res.status(500).send({ mensaje: 'Error al actualizar el cliente.', error });
  }
});

/**
 * Ruta GET para obtener clientes por tipo
 * @returns Lista de clientes del tipo especificado o un mensaje de error
 */
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

/**
 * Ruta GET para obtener clientes por dinero
 * @returns Lista de clientes con una cantidad exacta de dinero o un mensaje de error
 */
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