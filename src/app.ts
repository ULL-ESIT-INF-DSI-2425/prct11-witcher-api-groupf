import express from 'express';
import './db/mongoose.js';  
import { bienRouter } from './routers/bienes.js';  // Rutas para bienes

const app = express();

// Middleware para manejar JSON
app.use(express.json());

// Registrar los routers
app.use('/api/bienes', bienRouter);


// Ruta por defecto
app.get('/', (req, res) => {
  res.send('Bienvenido a la API de la Posada del Lobo Blanco');
});

// Puerto de escucha
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
