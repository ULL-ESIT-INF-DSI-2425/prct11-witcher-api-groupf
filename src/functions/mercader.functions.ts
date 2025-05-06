import { Mercader } from '../schemas/mercader.model.js';
import { MercaderDocumentInterface } from '../schemas/mercader.model.js';
import { Bien } from '../schemas/bien.model.js';


/**
 * Crea un nuevo mercader en la base de datos.
 */
export async function crearMercader(data: typeof Mercader) {
  const mercader = new Mercader(data);
  return await mercader.save();
}

/**
 * Obtiene todos los mercaderes.
 */
export async function obtenerMercaderes() {
  return await Mercader.find();
}

/**
 * Obtiene un mercader por su ID.
 */
export async function obtenerMercaderPorId(id: string) {
  return await Mercader.findById(id);
}

/**
 * Obtiene un mercader por su nombre.
 */
export async function obtenerMercaderPorNombre(nombre: string) {
  return await Mercader.find({ nombre });
}

/**
 * Actualiza un mercader por su ID.
 */
export async function actualizarMercader(id: string, updates: MercaderDocumentInterface) {
  return await Mercader.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
}

/**
 * Elimina un mercader por su ID.
 */
export async function eliminarMercader(id: string) {
  return await Mercader.findByIdAndDelete(id);
}
/**
 * Añade o actualiza un bien en el inventario de un mercader.
 * Si el bien ya existe, suma la cantidad. Si no existe, lo añade.
 */
export async function addBienToMercader(
  mercaderId: string, 
  { bienId, cantidad }: { bienId: string, cantidad: number }
) {
  const mercader = await Mercader.findById(mercaderId);
  if (!mercader) throw new Error('Mercader no encontrado');
  
  const bien = await Bien.findById(bienId);
  if (!bien) throw new Error('Bien no encontrado');

  // Inicializa inventario si es undefined (según esquema)
  if (!mercader.inventario) mercader.inventario = []; 

  // Busca si el bien ya existe en el mercader
  const bienExistenteIndex = mercader.inventario.findIndex(item => item.bienId.toString() === bienId);

  if (bienExistenteIndex !== -1) {
    // Si existe, suma la cantidad
    mercader.inventario[bienExistenteIndex].cantidad += cantidad;
  } else {
    // Si no existe, lo añade
    mercader.inventario.push({ bienId, cantidad });
  }

  await mercader.save();
  return mercader;
}

/**
 * Elimina o reduce la cantidad de un bien del inventario de un mercader.
 * @returns Mercader actualizado
 */
export async function removeBienFromMercader(
  mercaderId: string, 
  bienId: string, 
  cantidad?: number
) {
  const mercader = await Mercader.findById(mercaderId);
  if (!mercader) throw new Error('Mercader no encontrado');

  // Filtro seguro por si inventario es undefined
  if (!mercader.inventario) mercader.inventario = [];

  const bienIndex = mercader.inventario.findIndex(item => item.bienId.toString() === bienId);
  
  if (bienIndex === -1) {
    return mercader; // El bien no existe, no hay nada que hacer
  }

  if (cantidad === undefined) {
    // Eliminar completamente el bien
    mercader.inventario.splice(bienIndex, 1);
  } else {
    // Reducir la cantidad
    if (cantidad <= 0) throw new Error('La cantidad debe ser positiva');
    
    if (mercader.inventario[bienIndex].cantidad <= cantidad) {
      // Si la cantidad a eliminar es mayor o igual, elimina el bien completamente
      mercader.inventario.splice(bienIndex, 1);
    } else {
      // Reduce la cantidad
      mercader.inventario[bienIndex].cantidad -= cantidad;
    }
  }

  await mercader.save();
  return mercader;
}

/**
 * Verifica si un mercader tiene todos los bienes especificados con las cantidades requeridas
 * @returns boolean - true si tiene todos los bienes en las cantidades requeridas o mayores
 */
export async function mercaderTieneBienes(
  mercaderId: string, 
  bienesRequeridos: {bienId: string, cantidad: number}[]
) {
  const mercader = await Mercader.findById(mercaderId);
  if (!mercader) throw new Error('Mercader no encontrado');

  // Verifica si el mercader tiene todos los bienes en las cantidades requeridas
  return bienesRequeridos.every(requerido => {
    const bienEnInventario = mercader.inventario.find(item => 
      item.bienId.toString() === requerido.bienId
    );
    
    return bienEnInventario && bienEnInventario.cantidad >= requerido.cantidad;
  });
}

// funcioan para darle dinero a un mercader
export async function addDineroToMercader(mercaderId: string, dinero: number) {
  const mercader = await Mercader.findById(mercaderId);
  if (!mercader) throw new Error('Mercader no encontrado');
  mercader.dinero += dinero;
  await mercader.save();
  return mercader;
}

/**
 * Obtiene mercaderes por ubicación
 */
export async function obtenerMercaderesPorUbicacion(ubicacion: string) {
  return await Mercader.find({ ubicacion });
}

/**
 * Obtiene mercaderes por especialidad
 */
export async function obtenerMercaderesPorEspecialidad(especialidad: string) {
  return await Mercader.find({ especialidad });
}