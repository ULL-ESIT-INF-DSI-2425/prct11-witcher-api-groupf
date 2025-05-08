// transaccion.functions.ts
import { Transaccion } from '../schemas/transaccion.model.js';

/**
 * Crea una nueva transacción en la base de datos
 * @param data - Datos de la transacción a crear, debe coincidir con el tipo del modelo Transaccion
 * @returns - Promesa que resuelve con el documento de la transacción creada
 */
export async function crearTransaccionCompleta(data: typeof Transaccion) {
  const transaccion = new Transaccion(data);
  return await transaccion.save();
}

/**
 * Obtiene todas las transacciones almacenadas en la base de datos
 * @returns - Promesa que resuelve con un array de todas las transacciones
 */
export async function obtenerTransaccion() {
  return await Transaccion.find();
}

/**
 * Busca transacciones por el ID del cliente
 * @param id - ID del cliente a buscar
 * @returns - Promesa que resuelve con un array de transacciones que coinciden con el clienteId
 */
export async function obtenerTransaccionPorId(id: string) {
  return await Transaccion.findById(id);
}