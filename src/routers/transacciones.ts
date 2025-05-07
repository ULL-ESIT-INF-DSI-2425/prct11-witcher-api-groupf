import express from 'express';
import { crearTransaccionCompleta, obtenerTransaccion, obtenerTransaccionPorId} from '../functions/transaccion.functions.js';
import { obtenerMercaderPorId , actualizarMercader, removeBienFromMercader} from '../functions/mercader.functions.js';
import { obtenerClientePorId, actualizarCliente, addBienToCliente } from '../functions/cliente.functions.js';
import { obtenerBienPorId } from '../functions/bien.functions.js';



export const transaccionRouter = express.Router();

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


// GET - Obtener transacciones (todos o por nombre)
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


// GET - Obtener un transacciones por ID
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

//DELETE
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


///========================================================
// PATCH - Actualizar una transacción por ID
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

// GET - Obtener transacciones por cliente ID
transaccionRouter.get('/transacciones/cliente/:clienteId', async (req, res) => {
  try {
    const { clienteId } = req.params;
    const transacciones = await obtenerTransaccion();

    const transaccionesCliente = transacciones.filter(transaccion => transaccion.clienteId === clienteId);

    if (transaccionesCliente.length > 0) {
      res.status(200).send(transaccionesCliente);
    } else {
      res.status(404).send({ mensaje: 'No se encontraron transacciones para este cliente.' });
    }
  } catch (error) {
    res.status(500).send({ mensaje: 'Error al buscar transacciones por cliente.', error });
  }
});

// GET - Obtener transacciones por mercader ID
transaccionRouter.get('/transacciones/mercader/:mercaderId', async (req, res) => {
  try {
    const { mercaderId } = req.params;
    const transacciones = await obtenerTransaccion();

    const transaccionesMercader = transacciones.filter(transaccion => transaccion.mercaderId === mercaderId);

    if (transaccionesMercader.length > 0) {
      res.status(200).send(transaccionesMercader);
    } else {
      res.status(404).send({ mensaje: 'No se encontraron transacciones para este mercader.' });
    }
  } catch (error) {
    res.status(500).send({ mensaje: 'Error al buscar transacciones por mercader.', error });
  }
});

// GET - Obtener transacciones por rango de fechas
transaccionRouter.get('/transacciones/fecha', async (req, res) => {
  try {
    const { inicio, fin } = req.query;

    if (!inicio || !fin) {
      res.status(400).send({ mensaje: 'Debe proporcionar las fechas de inicio y fin.' });
      return;
    }

    const fechaInicio = new Date(inicio.toString());
    const fechaFin = new Date(fin.toString());

    const transacciones = await obtenerTransaccion();
    const transaccionesEnRango = transacciones.filter(transaccion =>
      new Date(transaccion.fecha) >= fechaInicio && new Date(transaccion.fecha) <= fechaFin
    );

    if (transaccionesEnRango.length > 0) {
      res.status(200).send(transaccionesEnRango);
    } else {
      res.status(404).send({ mensaje: 'No se encontraron transacciones en el rango de fechas especificado.' });
    }
  } catch (error) {
    res.status(500).send({ mensaje: 'Error al buscar transacciones por rango de fechas.', error });
  }
});