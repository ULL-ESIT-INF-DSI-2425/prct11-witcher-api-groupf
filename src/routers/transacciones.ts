import express from 'express';
import { crearTransaccionCompleta, obtenerTransaccion, obtenerTransaccionPorId} from '../functions/transaccion.functions.js';
import { obtenerMercaderPorId , actualizarMercader, removeBienFromMercader} from '../functions/mercader.functions.js';
import { obtenerClientePorId, actualizarCliente, addBienToCliente } from '../functions/cliente.functions.js';
import { obtenerBienPorId } from '../functions/bien.functions.js';

/**
 * Router de Express para manejar las operaciones CRUD de transacciones.
 */
export const transaccionRouter = express.Router();

/**
 * Ruta POST para crear una nueva transacción
 * @returns La transacción creada o un mensaje de error
 */
transaccionRouter.post('/transacciones', async (req, res) => {
  try {
    // Verifica que exista el mercader con el id
    const mercader = await obtenerMercaderPorId(req.body.mercaderId);
    if (!mercader) {
      res.status(404).send({ mensaje: 'Mercader no encontrado' });
      return;
    } 

    // Verifica que exista el cliente con el id
    const cliente = await obtenerClientePorId(req.body.clienteId);
    if (!cliente) {
      res.status(404).send({ mensaje: 'Cliente no encontrado' });
      return;
    }

    let total = 0;
    // Verifica que existan bienes con esos ids y calcula el total
    for (const item of req.body.bienes) {
      const bienExistente = await obtenerBienPorId(item.bienId);
      if (!bienExistente) {
        res.status(404).send({ mensaje: `Bien con ID ${item.bienId} no encontrado` });
        return;
      } else {
        total += bienExistente.valor * item.cantidad;
      }
    }

    // Verifica que el cliente tenga suficiente dinero
    if (cliente.dinero < total) {
      res.status(400).send({ mensaje: 'El cliente no tiene suficiente dinero para realizar la transacción' });
      return;
    }

    // Verifica que el mercader tenga los bienes en las cantidades requeridas
    for (const item of req.body.bienes) {
      const bienEnInventario = mercader.inventario.find(b => b.bienId.toString() === item.bienId);
      
      if (!bienEnInventario) {
        res.status(400).send({ mensaje: `El mercader no tiene el bien con ID ${item.bienId} en su inventario` });
        return;
      }
      
      if (bienEnInventario.cantidad < item.cantidad) {
        res.status(400).send({ 
          mensaje: `El mercader no tiene suficiente cantidad del bien ${item.bienId} (disponible: ${bienEnInventario.cantidad}, requerido: ${item.cantidad})`
        });
        return;
      }
    }

    // Actualiza el dinero del mercader y cliente
    mercader.dinero += total;
    await actualizarMercader(req.body.mercaderId, mercader);

    cliente.dinero -= total;
    await actualizarCliente(req.body.clienteId, cliente);

    // Transfiere los bienes del mercader al cliente
    for (const item of req.body.bienes) {
      // Quita el bien del mercader
      await removeBienFromMercader(req.body.mercaderId, item.bienId, item.cantidad);
      
      // Añade el bien al cliente
      await addBienToCliente(req.body.clienteId, {
        bienId: item.bienId,
        cantidad: item.cantidad
      });
    }

    // Crea la transacción en la base de datos
    const transaccion = await crearTransaccionCompleta({
      ...req.body,
      total,
      fecha: new Date()
    });
    
    res.status(201).send(transaccion);
  } catch (error) {
    res.status(400).send({ mensaje: (error as Error).message });
  }
});


/**
 * Ruta GET para obtener todas las transacciones
 * @returns Lista de transacciones o un mensaje de error
 */
transaccionRouter.get('/transacciones', async (req, res) => {
  try {
    const transacciones =  await obtenerTransaccion();
    if (transacciones.length > 0) {
      res.status(200).send(transacciones);
    } else {
      res.status(404).send({ mensaje: 'No se encontraron trnasacciones.' });
    }
  } catch (error) {
    res.status(500).send({ mensaje: 'Error interno del servidor', error });
  }
});


/**
 * Ruta GET para obtener una transacción por ID
 * @returns La transacción encontrada o un mensaje de error
 */
transaccionRouter.get('/transacciones/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const transacciones = await obtenerTransaccionPorId(id);

    if (transacciones) {
      res.status(200).send(transacciones);
    } else {
      res.status(404).send({ mensaje: 'transacciones no encontrado.' });
    }
  } catch (error) {
    res.status(500).send({ mensaje: 'Error al buscar el transacciones por ID', error });
  }
});



/**
 * Ruta PATCH para actualizar una transacción por ID
 * @returns La transacción actualizada o un mensaje de error
 * */
transaccionRouter.patch('/transacciones/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (updates._id) {
      res.status(400).send({ mensaje: 'No se puede modificar el ID de la transacción.' });
      return;
    }

    const transaccionActualizada = await obtenerTransaccionPorId(id);
    if (!transaccionActualizada) {
      res.status(404).send({ mensaje: 'Transacción no encontrada.' });
      return;
    }

    Object.assign(transaccionActualizada, updates);
    await transaccionActualizada.save();

    res.status(200).send({ mensaje: 'Transacción actualizada correctamente.', transaccion: transaccionActualizada });
  } catch (error) {
    res.status(500).send({ mensaje: 'Error al actualizar la transacción.', error });
  }
});


/**
 * Ruta DELETE para eliminar una transacción por ID
 * @returns Mensaje de éxito o error
 */
transaccionRouter.delete('/transacciones/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const transaccionEliminada = await obtenerTransaccionPorId(id);

    if (transaccionEliminada) {
      res.status(200).send({ mensaje: 'Transacción eliminada correctamente.', transaccion: transaccionEliminada });
    } else {
      res.status(404).send({ mensaje: 'Transacción no encontrada.' });
    }
  } catch (error) {
    res.status(500).send({ mensaje: 'Error al eliminar la transacción', error });
  }
});