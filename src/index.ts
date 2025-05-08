import { app } from "./app.js";

/**
 * Inicia el servidor Express en el puerto especificado.
 * Si no se especifica un puerto, se usará el puerto 3000 por defecto.
 */
const port = process.env.PORT || 3000;

/**
 * Conexión a la base de datos MongoDB.
 * Si la conexión falla, se mostrará un mensaje de error en la consola.
 */
app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});

