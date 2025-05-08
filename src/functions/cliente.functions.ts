import { Cliente, ClienteDocumentInterface } from '../schemas/cliente.model.js';
import { Bien } from '../schemas/bien.model.js';  

/**
 * Crea un nuevo cliente en la base de datos
 * @param data - Datos del cliente a crear, debe coincidir con el tipo del modelo Cliente
 * @returns - Promesa que resuelve con el documento del cliente creado
 */
export async function crearCliente(data: typeof Cliente) {
    const cliente = new Cliente(data);
    return await cliente.save();
}

/**
 * Obtiene todos los clientes almacenados en la base de datos
 * @returns - Promesa que resuelve con un array de todos los clientes
 */
export async function obtenerClientes() {
    return await Cliente.find();
}

/**
 * Obtiene un cliente específico por su ID único
 * @param id - ID del cliente a buscar
 * @returns Promesa que resuelve con el documento del cliente encontrado o null si no existe
 */
export async function obtenerClientePorId(id: string) {
  return await Cliente.findById(id);
}

/**
 * Busca clientes por su nombre (puede devolver múltiples resultados si hay nombres duplicados)
 * @param nombre - Nombre del cliente a buscar
 * @returns Promesa que resuelve con un array de clientes que coinciden con el nombre
 */
export async function obtenerClientePorNombre(nombre: string) {
  return await Cliente.find({ nombre });
}

/**
 * Actualiza un cliente existente identificado por su ID
 * @param id - ID del cliente a actualizar
 * @param updates - Objeto con las propiedades a actualizar
 * @returns Promesa que resuelve con el documento del cliente actualizado o null si no se encontró
 */
export async function actualizarCliente(id: string, updates: ClienteDocumentInterface) {
  return await Cliente.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
}

/**
 * Elimina un cliente de la base de datos por su ID
 * @param id - ID del cliente a eliminar
 * @returns Promesa que resuelve con el documento eliminado o null si no se encontró
 */
export async function eliminarCliente(id: string) {
  return await Cliente.findByIdAndDelete(id);
}

/**
 * Añade un bien a un cliente (recibe clienteId y bienId).
 * @param clienteId - ID del cliente
 * @returns - El cliente actualizado
 */
export async function addBienToCliente(clienteId: string, { bienId, cantidad }: { bienId: string, cantidad: number }) {
  // Verifica que existan ambos
  const cliente = await Cliente.findById(clienteId);
  if (!cliente) throw new Error('Cliente no encontrado');
  
  const bien = await Bien.findById(bienId);
  if (!bien) throw new Error('Bien no encontrado');

  // Busca si el bien ya existe en el cliente
  const bienExistenteIndex = cliente.bienes.findIndex(item => item.bienId.toString() === bienId);

  if (bienExistenteIndex !== -1) {
    // Si existe, suma la cantidad
    cliente.bienes[bienExistenteIndex].cantidad += cantidad;
  } else {
    // Si no existe, lo añade
    cliente.bienes.push({ bienId, cantidad });
  }

  await cliente.save();
  return cliente;
}


/**
 * Elimina un bien de un cliente (recibe clienteId y bienId).
 * @param clienteId - ID del cliente
 * @param bienId - ID del bien
 * @param cantidad - Cantidad a eliminar (opcional)
 * @returns - El cliente actualizado
 */
export async function removeBienFromCliente(
  clienteId: string, 
  bienId: string, 
  cantidad?: number
) {
  const cliente = await Cliente.findById(clienteId);
  if (!cliente) throw new Error('Cliente no encontrado');

  const bienIndex = cliente.bienes.findIndex(item => item.bienId.toString() === bienId);
  
  if (bienIndex === -1) {
    return cliente; // El bien no existe, no hay nada que hacer
  }

  if (cantidad === undefined) {
    // Eliminar completamente el bien
    cliente.bienes.splice(bienIndex, 1);
  } else {
    // Reducir la cantidad
    if (cantidad <= 0) throw new Error('La cantidad debe ser positiva');
    
    if (cliente.bienes[bienIndex].cantidad <= cantidad) {
      // Si la cantidad a eliminar es mayor o igual, elimina el bien completamente
      cliente.bienes.splice(bienIndex, 1);
    } else {
      // Reduce la cantidad
      cliente.bienes[bienIndex].cantidad -= cantidad;
    }
  }

  await cliente.save();
  return cliente;
}

/**
 * Añade dinero a un cliente
 * @param clienteId - ID del cliente
 * @param dinero - Cantidad de dinero a añadir
 * @returns - El cliente actualizado
 */
export async function quitarDineroCliente(clienteId: string, dinero: number) {
  const cliente = await Cliente.findById(clienteId);
  if (!cliente) throw new Error('Cliente no encontrado');
  cliente.dinero -= dinero;
  await cliente.save();
  return cliente;
}

