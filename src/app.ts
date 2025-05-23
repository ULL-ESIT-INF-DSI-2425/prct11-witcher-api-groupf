import express from 'express';
import './db/mongoose.js';
import { clienteRouter } from './routers/cliente.js';
import { mercaderRouter } from './routers/mercaderes.js';
import { bienesRouter } from './routers/bienes.js';
import { defaultRouter } from './routers/defaults.js';
import { transaccionRouter } from './routers/transacciones.js';

export const app = express();
app.use(express.json());
app.use(clienteRouter);
app.use(mercaderRouter);
app.use(bienesRouter);
app.use(transaccionRouter);
app.use(defaultRouter);