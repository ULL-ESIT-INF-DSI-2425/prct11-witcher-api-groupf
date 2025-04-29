import express from 'express';
import './db/mongoose.js';
import { clienteRouter } from './routers/cliente.js';
import { defaultRouter } from './routers/defaults.js';

const app = express();
app.use(express.json());
app.use(clienteRouter);
app.use(defaultRouter);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});