import { Bien, BienDocumentInterface } from '../schemas/bien.model.js';

/**
 * Crea un nuevo bien en la base de datos.
 */
export async function crearBien(data: typeof Bien) {
  const bien = new Bien(data);
  return await bien.save();
}

/**
 * Obtiene todos los bienes o busca por nombre/descripción.
 */
export async function obtenerBienes()  {
  return await Bien.find();
}

/**
 * Obtiene un bien por su ID único.
 */
export async function obtenerBienPorId(id: string) {
  return await Bien.findById(id);
}

/**
 * Obtiene un bien por su nombre único.
 */
export async function obtenerBienPorNombre(nombre: string) {
  return await Bien.find({ nombre });
}

/**
 * Actualiza un bien por su ID único.
 */
export async function actualizarBien(id: string, updates: BienDocumentInterface) {
  return await Bien.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
}

/**
 * Elimina un bien por su ID único.
 */
export async function eliminarBien(id: string) {
  return await Bien.findByIdAndDelete(id);
}