import { Cliente, ClienteDocumentInterface } from '../schemas/cliente.model.js';
import { Bien } from '../schemas/bien.model.js';  


/**
 * Crea un nuevo cliente en la base de datos.
 */
export async function crearCliente(data: typeof Cliente) {
    const cliente = new Cliente(data);
    return await cliente.save();
}

/**
 * Obtiene clientes. todos los clientes
 */
export async function obtenerClientes() {
    return await Cliente.find();
}

/**
 * Obtiene un cliente por su ID.
 */
export async function obtenerClientePorId(id: string) {
  return await Cliente.findById(id);
}

/**
 * Obtiene un cliente por su nombre.
 */
export async function obtenerClientePorNombre(nombre: string) {
  return await Cliente.find({ nombre });
}

/**
 * Actualiza un cliente por su ID.
 */
export async function actualizarCliente(id: string, updates: ClienteDocumentInterface) {
  return await Cliente.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
}

/**
 * Elimina un cliente por su ID.
 */
export async function eliminarCliente(id: string) {
  return await Cliente.findByIdAndDelete(id);
}


/**
 * Añade o actualiza un bien en un cliente (recibe clienteId y objeto BienCantidad).
 * Si el bien ya existe, suma la cantidad. Si no existe, lo añade.
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


// funcion para quietarle dinero al cliente por su id
export async function quitarDineroCliente(clienteId: string, dinero: number) {
  const cliente = await Cliente.findById(clienteId);
  if (!cliente) throw new Error('Cliente no encontrado');
  cliente.dinero -= dinero;
  await cliente.save();
  return cliente;
}

/**
 * Obtiene clientes por su tipo
 */
export async function obtenerClientesPorTipo(tipo: string) {
  return await Cliente.find({ tipo });
}

/**
 * Obtiene clientes por cantidad de dinero
 */
export async function obtenerClientesPorDinero(dinero: number) {
  return await Cliente.find({ dinero });
}
