import express from 'express';
import { crearTransaccionCompleta, obtenerTransaccion, obtenerTransaccionPorId} from '../functions/transaccion.functions.js';
import { obtenerMercaderPorId , actualizarMercader, removeBienFromMercader} from '../functions/mercader.functions.js';
import { obtenerClientePorId, actualizarCliente, addBienToCliente } from '../functions/cliente.functions.js';
import { obtenerBienPorId } from '../functions/bien.functions.js';

export const transaccionRouter = express.Router();

transaccionRouter.post('/transacciones', async (req, res) => {
  try {
    // verifica que exista el mercader con el id
    const mercader = await obtenerMercaderPorId(req.body.mercaderId);
    if (!mercader) {
      res.status(404).send({ mensaje: 'Mercader no encontrado' });
      return;
    } 

    // verifica que exista el cliente con el id
    const cliente = await obtenerClientePorId(req.body.clienteId);
    if (!cliente) {
      res.status(404).send({ mensaje: 'Cliente no encontrado' });
      return;
    }

    let total = 0;
    // verifica que existan bienes con esos ids
    for (const bien of req.body.bienes) {
      const bienExistente = await obtenerBienPorId(bien);
      if (!bienExistente) {
        res.status(404).send({ mensaje: `Bien con ID ${bien} no encontrado` });
        return;
      }else{
        total += bienExistente.valor;
      }
    }

    // verifica que el cliente tenga suficiente dinero
    if (cliente.dinero < total) {
      res.status(400).send({ mensaje: 'El cliente no tiene suficiente dinero para realizar la transacción' });
      return;
    }

    // verifica que el mercader tenga ese bien en su inventario
    for (const bien of req.body.bienes) {
      const mercader = await obtenerMercaderPorId(req.body.mercaderId);
      if (!mercader) {
        res.status(404).send({ mensaje: 'Mercader no encontrado' });
        return;
      }
      if (!mercader.inventario.includes(bien)) {
        res.status(400).send({ mensaje: `El mercader no tiene el bien con ID ${bien} en su inventario` });
        return;
      }
    }

    // Usando la funcion actualizarMercader para quitarle el dinero
    mercader.dinero += total;
    await actualizarMercader(req.body.mercaderId, mercader);

    cliente.dinero -= total;
    await actualizarCliente(req.body.clienteId, cliente);

    // Usando la funcion removeBienFromMercader para quitarle el bien al mercader
    for (const bien of req.body.bienes) {
      await removeBienFromMercader(req.body.mercaderId, bien);
    }
    // Usando la funcion addBienToCliente para agregarle el bien al cliente
    for (const bien of req.body.bienes) {
      await addBienToCliente(req.body.clienteId, bien);
    }
    const transaccion = await crearTransaccionCompleta(req.body);
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