/*
import express from 'express';
import { BienModel } from '../mongose/bien.model.js';

export const bienRouter = express.Router();

// Crear un bien
bienRouter.post('/bienes', (req, res) => {
  const bien = new BienModel(req.body);

  bien.save().then((bienGuardado) => {
    res.status(201).send(bienGuardado);
  }).catch((error) => {
    res.status(400).send(error);
  });
});

// Obtener todos los bienes o uno por nombre
bienRouter.get('/bienes', (req, res) => {
  const filter = req.query.nombre ? { nombre: req.query.nombre.toString() } : {};

  BienModel.find(filter).then((bienes) => {
    if (bienes.length !== 0) {
      res.send(bienes);
    } else {
      res.status(404).send();
    }
  }).catch(() => {
    res.status(500).send();
  });
});

// Obtener un bien por id
bienRouter.get('/bienes/:id', (req, res) => {
  BienModel.findById(req.params.id).then((bien) => {
    if (!bien) {
      res.status(404).send();
    } else {
      res.send(bien);
    }
  }).catch(() => {
    res.status(500).send();
  });
});

// Actualizar un bien por nombre
bienRouter.patch('/bienes', (req, res) => {
  if (!req.query.nombre) {
    res.status(400).send({
      error: 'A nombre must be provided in the query string',
    });
  } else if (!req.body || Object.keys(req.body).length === 0) {
    res.status(400).send({
      error: 'Fields to be modified have to be provided in the request body',
    });
  } else {
    const allowedUpdates = ['nombre', 'tipo', 'valor'];
    const actualUpdates = Object.keys(req.body);
    const isValidUpdate = actualUpdates.every((update) => allowedUpdates.includes(update));

    if (!isValidUpdate) {
      res.status(400).send({
        error: 'Update is not permitted',
      });
    } else {
      BienModel.findOneAndUpdate(
        { nombre: req.query.nombre.toString() },
        req.body,
        { new: true, runValidators: true }
      ).then((bienActualizado) => {
        if (!bienActualizado) {
          res.status(404).send();
        } else {
          res.send(bienActualizado);
        }
      }).catch((error) => {
        res.status(400).send(error);
      });
    }
  }
});

// Actualizar un bien por id
bienRouter.patch('/bienes/:id', (req, res) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    res.status(400).send({
      error: 'Fields to be modified have to be provided in the request body',
    });
  } else {
    const allowedUpdates = ['nombre', 'tipo', 'valor'];
    const actualUpdates = Object.keys(req.body);
    const isValidUpdate = actualUpdates.every((update) => allowedUpdates.includes(update));

    if (!isValidUpdate) {
      res.status(400).send({
        error: 'Update is not permitted',
      });
    } else {
      BienModel.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      ).then((bienActualizado) => {
        if (!bienActualizado) {
          res.status(404).send();
        } else {
          res.send(bienActualizado);
        }
      }).catch((error) => {
        res.status(400).send(error);
      });
    }
  }
});

// Borrar un bien por nombre
bienRouter.delete('/bienes', (req, res) => {
  if (!req.query.nombre) {
    res.status(400).send({
      error: 'A nombre must be provided',
    });
  } else {
    BienModel.findOneAndDelete({ nombre: req.query.nombre.toString() })
      .then((bienBorrado) => {
        if (!bienBorrado) {
          res.status(404).send();
        } else {
          res.send(bienBorrado);
        }
      }).catch(() => {
        res.status(400).send();
      });
  }
});

// Borrar un bien por id
bienRouter.delete('/bienes/:id', (req, res) => {
  BienModel.findByIdAndDelete(req.params.id)
    .then((bienBorrado) => {
      if (!bienBorrado) {
        res.status(404).send();
      } else {
        res.send(bienBorrado);
      }
    }).catch(() => {
      res.status(400).send();
    });
});

*/
