import { Mercader } from '../schemas/mercader.model.js';
import { MercaderDocumentInterface } from '../schemas/mercader.model.js';
import { Bien } from '../schemas/bien.model.js';


/**
 * Crea un nuevo mercader en la base de datos
 * @param data - Datos del mercader a crear, debe coincidir con el tipo del modelo Mercader
 * @returns - Promesa que resuelve con el documento del mercader creado
 */
export async function crearMercader(data: typeof Mercader) {
  const mercader = new Mercader(data);
  return await mercader.save();
}

/**
 * Obtiene todos los mercaderes almacenados en la base de datos
 * @returns - Promesa que resuelve con un array de todos los mercaderes
 */
export async function obtenerMercaderes() {
  return await Mercader.find();
}

/**
 * Obtiene un mercader específico por su ID único
 * @param id - ID del mercader a buscar
 * @returns Promesa que resuelve con el documento del mercader encontrado o null si no existe
 */
export async function obtenerMercaderPorId(id: string) {
  return await Mercader.findById(id);
}

/**
 * Busca mercaderes por su nombre (puede devolver múltiples resultados si hay nombres duplicados)
 * @param nombre - Nombre del mercader a buscar
 * @returns Promesa que resuelve con un array de mercaderes que coinciden con el nombre
 */
export async function obtenerMercaderPorNombre(nombre: string) {
  return await Mercader.find({ nombre });
}

/**
 * Actualiza un mercader existente identificado por su ID
 * @param id - ID del mercader a actualizar
 * @param updates - Objeto con las propiedades a actualizar
 * @returns Promesa que resuelve con el documento del mercader actualizado o null si no se encontró
 */
export async function actualizarMercader(id: string, updates: MercaderDocumentInterface) {
  return await Mercader.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
}

/**
 * Elimina un mercader de la base de datos por su ID
 * @param id - ID del mercader a eliminar
 * @returns Promesa que resuelve con el documento eliminado o null si no se encontró
 */
export async function eliminarMercader(id: string) {
  return await Mercader.findByIdAndDelete(id);
}

/**
 * Añade un bien al inventario de un mercader o aumenta su cantidad si ya existe.
 * @param mercaderId - ID del mercader
 * @param param1 - Objeto que contiene el ID del bien y la cantidad a añadir
 * @returns - Mercader actualizado
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
 * Elimina un bien del inventario de un mercader o reduce su cantidad.
 * @param mercaderId - ID del mercader
 * @param bienId - ID del bien a eliminar
 * @param cantidad - Cantidad a eliminar (opcional)
 * @returns - Mercader actualizado
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
 * Verifica si un mercader tiene los bienes requeridos en las cantidades especificadas.
 * @param mercaderId - ID del mercader
 * @param bienesRequeridos - Array de objetos que contienen el ID del bien y la cantidad requerida
 * @returns - Verdadero si el mercader tiene todos los bienes requeridos, falso de lo contrario
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
 * @param ubicacion - Ubicación del mercader
 * @returns - Lista de mercaderes en la ubicación especificada
 */
export async function obtenerMercaderesPorUbicacion(ubicacion: string) {
  return await Mercader.find({ ubicacion });
}

/**
 * Obtiene mercaderes por especialidad
 * @param especialidad - Especialidad del mercader
 * @returns - Lista de mercaderes con la especialidad especificada
 */
export async function obtenerMercaderesPorEspecialidad(especialidad: string) {
  return await Mercader.find({ especialidad });
}