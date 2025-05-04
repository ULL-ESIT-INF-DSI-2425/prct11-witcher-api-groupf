import express from 'express';
import { crearBien, obtenerBienes, obtenerBienPorId, actualizarBien, eliminarBien, obtenerBienPorNombre} from '../functions/bien.functions.js';
import { BienDocumentInterface } from '../schemas/bien.model.js';

export const bienesRouter = express.Router();





// POST - Crear un nuevo bien
bienesRouter.post('/bienes', async (req, res) => {
  try {
    const bien = await crearBien(req.body);
    res.status(201).send(bien);
  } catch (error) {
    res.status(400).send(error);
  }
});

// GET - Obtener bienes (todos o por filtros)
bienesRouter.get('/bienes', async (req, res) => {
  try {
    const nombre = req.query.nombre?.toString();

    const bienes = nombre
      ? await obtenerBienPorNombre(nombre)
      : await obtenerBienes();

    if (bienes.length > 0) {
      res.status(200).send(bienes);
    } else {
      res.status(404).send({ mensaje: 'No se encontraron clientes.' });
    }
  } catch (error) {
    res.status(500).send({ mensaje: 'Error interno del servidor', error });
  }
});


// GET - Obtener el valor de un bien por ID
bienesRouter.get('/bienes/:id/obtener-valor', async (req, res) => {
  try {
    const { id } = req.params;

    // Obtener el bien por ID
    const bien = await obtenerBienPorId(id);
    if (!bien) {
      res.status(404).send({ mensaje: 'Bien no encontrado.' });
      return;
    }

    // Devolver el valor del bien
    res.status(200).send({ mensaje: 'Valor del bien obtenido correctamente.', valor: bien.valor });
  } catch (error) {
    res.status(500).send({ mensaje: 'Error al obtener el valor del bien.', error });
  }
});


// GET - Obtener un bien por ID
bienesRouter.get('/bienes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const bien = await obtenerBienPorId(id);
    if (bien) {
      res.status(200).send(bien);
    } else {
      res.status(404).send({ mensaje: 'Bien no encontrado' });
    }
  } catch (error) {
    res.status(500).send({ mensaje: 'Error al obtener el bien', error });
  }
});



// PATCH - Actualizar un bien por ID
bienesRouter.patch('/bienes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (updates._id) {
      res.status(400).send({ mensaje: 'No se puede modificar el ID del bien.' });
      return;
    }

    const bienActualizado = await actualizarBien(id, updates);
    if (bienActualizado) {
      res.status(200).send(bienActualizado);
    } else {
      res.status(404).send({ mensaje: 'Bien no encontrado' });
    }
  } catch (error) {
    res.status(500).send({ mensaje: 'Error al actualizar el bien', error });
  }
});

// DELETE - Eliminar un bien por ID
bienesRouter.delete('/bienes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const bienEliminado = await eliminarBien(id);
    if (bienEliminado) {
      res.status(200).send({ mensaje: 'Bien eliminado correctamente' });
    } else {
      res.status(404).send({ mensaje: 'Bien no encontrado' });
    }
  } catch (error) {
    res.status(500).send({ mensaje: 'Error al eliminar el bien', error });
  }
});

// OPTIONS - Ordenar bienes
bienesRouter.options('/bienes/ordenar', async (req, res) => {
  try {
    const { ordenar, ascendente } = req.body;

    // Validar que "ordenar" sea una clave válida de BienDocumentInterface
    const camposValidos: (keyof BienDocumentInterface)[] = ['idUnico', 'nombre', 'descripcion', 'valor', 'tipo'];
    if (!ordenar || !camposValidos.includes(ordenar)) {
      res.status(400).send({ mensaje: `El campo "${ordenar}" no es válido para ordenar.` });
      return;
    }

    const bienes = await obtenerBienes();

    if (bienes.length === 0) {
      res.status(404).send({ mensaje: 'No se encontraron bienes.' });
      return;
    }

    // Ordenar los bienes
    const bienesOrdenados = bienes.sort((a, b) => {
      const valorA = a[ordenar as keyof BienDocumentInterface]?.toString().toLowerCase() || '';
      const valorB = b[ordenar as keyof BienDocumentInterface]?.toString().toLowerCase() || '';
      return ascendente ? valorA.localeCompare(valorB) : valorB.localeCompare(valorA);
    });

    res.status(200).send(bienesOrdenados);
  } catch (error) {
    res.status(500).send({ mensaje: 'Error al ordenar los bienes.', error });
  }
});




