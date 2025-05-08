import express from 'express';

/**
 * Router para manejar rutas no definidas
 * @returns Un mensaje de error 501
 */
export const defaultRouter = express.Router();

/**
 * Ruta para manejar todas las peticiones no definidas
 * @returns Un mensaje de error 501
 */
defaultRouter.all('/{*splat}', (_, res) => {
  res.status(501).send();
});


