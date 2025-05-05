import express from 'express';
import { crearTransaccionCompleta, obtenerTransaccion, obtenerTransaccionPorId} from '../functions/transaccion.functions.js';
import { obtenerMercaderPorId , actualizarMercader, removeBienFromMercader} from '../functions/mercader.functions.js';
import { obtenerClientePorId, actualizarCliente, addBienToCliente } from '../functions/cliente.functions.js';
import { obtenerBienPorId } from '../functions/bien.functions.js';
import { TransaccionDocumentInterface } from '../schemas/transaccion.model.js';


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

// GET - Obtener el total de una transacción por ID
transaccionRouter.get('/transacciones/:id/total', async (req, res) => {
  try {
    const { id } = req.params;

    // Obtener la transacción por ID
    const transaccion = await obtenerTransaccionPorId(id) as TransaccionDocumentInterface;
    if (!transaccion) {
      res.status(404).send({ mensaje: 'Transacción no encontrada.' });
      return;
    }

    // Obtener los objetos completos de los bienes
    const bienesCompletos = await Promise.all(
      transaccion.bienes.map(async (bienId) => {
        const bien = await obtenerBienPorId(bienId);
        if (!bien) {
          throw new Error(`El bien con ID ${bienId} no existe.`);
        }
        return bien;
      })
    );

    // Calcular el total de la transacción
    const total = bienesCompletos.reduce((acumulador, bien) => {
      return acumulador + bien.valor;
    }, 0);

    // Devolver el total de la transacción
    res.status(200).send({ mensaje: 'Total de la transacción obtenido correctamente.', total });
  } catch (error) {
    res.status(500).send({ mensaje: 'Error al obtener el total de la transacción.', error });
  }
});

transaccionRouter.options('/transacciones/ordenar', async (req, res) => {
  try {
    const { ordenar, ascendente } = req.body;

    // Validar que los parámetros necesarios estén presentes
    if (!ordenar || typeof ascendente === 'undefined') {
      res.status(400).send({ mensaje: 'Se requieren los campos "ordenar" y "ascendente".' });
      return;
    }

    const orden = ascendente ? 1 : -1; // 1 para ascendente, -1 para descendente
    const transacciones = await obtenerTransaccion();

    // Verificar si hay transacciones
    if (transacciones.length === 0) {
      res.status(404).send({ mensaje: 'No se encontraron transacciones.' });
      return;
    }

    // Verificar que el campo "ordenar" sea válido
    if (!(ordenar in transacciones[0])) {
      res.status(400).send({ mensaje: `El campo "${ordenar}" no es válido para ordenar.` });
      return;
    }

    // Ordenar las transacciones según el campo y el orden especificado
    const transaccionesOrdenadas = transacciones.sort((a, b) => {
      const valorA = a[ordenar as keyof TransaccionDocumentInterface]?.toString().toLowerCase();
      const valorB = b[ordenar as keyof TransaccionDocumentInterface]?.toString().toLowerCase();

      if (valorA < valorB) return -orden;
      if (valorA > valorB) return orden;
      return 0;
    });

    // Enviar las transacciones ordenadas
    res.status(200).send(transaccionesOrdenadas);
  } catch (error) {
    res.status(500).send({ mensaje: 'Error al ordenar las transacciones.', error });
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



