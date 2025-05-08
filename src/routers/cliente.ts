import express from 'express';
import { crearCliente, obtenerClientePorNombre, obtenerClientes , obtenerClientePorId, eliminarCliente, actualizarCliente} from '../functions/cliente.functions.js';

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
 * Ruta DELETE para eliminar un cliente por nombre usando query
 * @returns Mensaje de éxito o error
 */
clienteRouter.delete('/clientes', async (req, res) => { 
  try {
    const nombre = req.query.nombre?.toString();

    if (!nombre || nombre.trim() === "") {
      res.status(400).send({ mensaje: 'Se requiere un nombre válido del cliente como query (?nombre=...)' });
      return;
    }
    const clientes = await obtenerClientePorNombre(nombre);
    if (clientes.length === 0) {
      res.status(404).send({ mensaje: `Cliente con nombre "${nombre}" no encontrado.` });
      return;
    }
    const clienteEliminado = await eliminarCliente(clientes[0]._id as string);
    if (clienteEliminado) {
      res.status(200).send({ mensaje: `Cliente con nombre "${nombre}" eliminado correctamente.` });
    } else {
      res.status(404).send({ mensaje: `Error al eliminar el cliente con nombre "${nombre}".` });
    }
  } catch (error) {
    res.status(500).send({ mensaje: 'Error al eliminar el cliente.', error: error instanceof Error ? error.message : error });
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