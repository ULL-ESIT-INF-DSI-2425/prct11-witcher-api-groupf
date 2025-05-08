import { Bien, BienDocumentInterface } from '../schemas/bien.model.js';

/**
 * Crea un nuevo bien en la base de datos
 * @param data - Datos del bien a crear, debe coincidir con el tipo del modelo Bien
 * @returns - Promesa que resuelve con el documento del bien creado
 */
export async function crearBien(data: typeof Bien) {
  const bien = new Bien(data);
  return await bien.save();
}

/**
 * Obtiene todos los bienes almacenados en la base de datos
 * @returns - Promesa que resuelve con un array de todos los bienes
 */
export async function obtenerBienes() {
  return await Bien.find();
}

/**
 * Obtiene un bien específico por su ID único
 * @param id - ID del bien a buscar
 * @returns Promesa que resuelve con el documento del bien encontrado o null si no existe
 */
export async function obtenerBienPorId(id: string) {
  return await Bien.findById(id);
}

/**
 * Busca bienes por su nombre (puede devolver múltiples resultados si hay nombres duplicados)
 * @param nombre - Nombre del bien a buscar
 * @returns Promesa que resuelve con un array de bienes que coinciden con el nombre
 */
export async function obtenerBienPorNombre(nombre: string) {
  return await Bien.find({ nombre });
}

/**
 * Actualiza un bien existente identificado por su ID
 * @param id - ID del bien a actualizar
 * @param updates - Objeto con las propiedades a actualizar
 * @returns Promesa que resuelve con el documento del bien actualizado o null si no se encontró
 */
export async function actualizarBien(id: string, updates: BienDocumentInterface) {
  return await Bien.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
}

/**
 * Elimina un bien de la base de datos por su ID
 * @param id - ID del bien a eliminar
 * @returns Promesa que resuelve con el documento eliminado o null si no se encontró
 */
export async function eliminarBien(id: string) {
  return await Bien.findByIdAndDelete(id);
}

/**
 * Obtiene el ID de un bien buscando por su nombre
 * @param nombre - Nombre del bien a buscar
 * @returns Promesa que resuelve con el ID del bien encontrado o null si no existe
 */
export async function obtenerIdBienPorNombre(nombre: string) {
  const bien = await Bien.findOne({ nombre });
  return bien ? bien._id : null;
}
