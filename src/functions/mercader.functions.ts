import { Merchant } from '../schemas/mercadel.model.js';


/**
 * Crea un nuevo mercader en la base de datos.
 */
export async function crearMercader(data: typeof Merchant) {
  const mercader = new Merchant(data);
  return await mercader.save();
}

/**
 * Obtiene todos los mercaderes.
 */
export async function obtenerMercaderes() {
  return await Merchant.find();
}

/**
 * Obtiene un mercader por su ID.
 */
export async function obtenerMercaderPorId(id: string) {
  return await Merchant.findById(id);
}

/**
 * Obtiene un mercader por su nombre.
 */
export async function obtenerMercaderPorNombre(nombre: string) {
  return await Merchant.find({ nombre });
}

/**
 * Elimina un mercader por su ID.
 */
export async function eliminarMercader(id: string) {
  return await Merchant.findByIdAndDelete(id);
}