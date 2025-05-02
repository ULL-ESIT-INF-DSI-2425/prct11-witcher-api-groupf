// transaccion.functions.ts
import { Transaccion } from '../schemas/transaccion.model.js';

/**
 * Crea un nuevo mercader en la base de datos.
 */
export async function crearTransaccionCompleta(data: typeof Transaccion) {
  const mercader = new Transaccion(data);
  return await mercader.save();
}

/**
 * Obtiene todos los mercaderes.
 */
export async function obtenerTransaccion() {
  return await Transaccion.find();
}

/**
 * Obtiene un mercader por su ID.
 */
export async function obtenerTransaccionPorId(id: string) {
  return await Transaccion.findById(id);
}

/**
 * Obtiene un mercader por su nombre.
 */
export async function obtenerTransaccionPorNombre(nombre: string) {
  return await Transaccion.find({ nombre });
}