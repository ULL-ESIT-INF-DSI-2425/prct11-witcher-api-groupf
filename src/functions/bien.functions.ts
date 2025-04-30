import { Bien } from '../schemas/bien.model.js';

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
export async function obtenerBienes(query: Partial<{ nombre: string; descripcion: string }>) {
  const filtros: any = {};
  if (query.nombre) filtros.nombre = query.nombre;
  if (query.descripcion) filtros.descripcion = query.descripcion;

  return await Bien.find(filtros);
}

/**
 * Obtiene un bien por su ID único.
 */
export async function obtenerBienPorId(id: string) {
  return await Bien.findById(id);
}

/**
 * Actualiza un bien por su ID único.
 */
export async function actualizarBien(id: string, updates: Partial<typeof Bien>) {
  return await Bien.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
}

/**
 * Elimina un bien por su ID único.
 */
export async function eliminarBien(id: string) {
  return await Bien.findByIdAndDelete(id);
}