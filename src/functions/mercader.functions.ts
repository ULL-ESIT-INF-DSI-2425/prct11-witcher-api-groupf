import { Merchant } from '../schemas/mercadel.model.js';
import { MerchantDocumentInterface } from '../schemas/mercadel.model.js';
import { Bien } from '../schemas/bien.model.js';


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
 * Actualiza un mercader por su ID.
 */
export async function actualizarMercader(id: string, updates: MerchantDocumentInterface) {
  return await Merchant.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
}

/**
 * Elimina un mercader por su ID.
 */
export async function eliminarMercader(id: string) {
  return await Merchant.findByIdAndDelete(id);
}

/**
 * Añade un bien al inventario de un mercader (recibe 2 IDs: mercaderId y bienId).
 */
export async function addBienToMercader(mercaderId: string, bienId: string) {
  const mercader = await Merchant.findById(mercaderId);
  if (!mercader) throw new Error('Mercader no encontrado');
  
  const bien = await Bien.findById(bienId);
  if (!bien) throw new Error('Bien no encontrado');

  // Inicializa inventario si es undefined (según esquema)
  if (!mercader.inventario) mercader.inventario = []; 

  // Evita duplicados
  if (!mercader.inventario.includes(bienId)) {
    mercader.inventario.push(bienId);
    await mercader.save();
  }
  return mercader;
}

/**
 * Elimina un bien del inventario de un mercader (recibe 2 IDs: mercaderId y bienId).
 */
export async function removeBienFromMerchant(mercaderId: string, bienId: string) {
  const mercader = await Merchant.findById(mercaderId);
  if (!mercader) throw new Error('Mercader no encontrado');

  // Filtra el bien a eliminar
  mercader.inventario = mercader.inventario?.filter(b => b.toString() !== bienId) || [];
  await mercader.save();
  return mercader;
}

// funcion que recibe un id de mercader y un vetor de ids de bienes y devuelve bool si el mercader tiene todos los bienes
export async function mercaderTieneBienes(mercaderId: string, bienesIds: string[]) {
  const mercader = await Merchant.findById(mercaderId);
  if (!mercader) throw new Error('Mercader no encontrado');
  // Verifica si el mercader tiene todos los bienes
  const tieneTodos = bienesIds.every(bienId => mercader.inventario.includes(bienId));
  return tieneTodos;
}

// funcioan para darle dinero a un mercader
export async function addDineroToMercader(mercaderId: string, dinero: number) {
  const mercader = await Merchant.findById(mercaderId);
  if (!mercader) throw new Error('Mercader no encontrado');
  mercader.dinero += dinero;
  await mercader.save();
  return mercader;
}