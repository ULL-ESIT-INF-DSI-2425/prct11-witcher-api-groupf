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
 * Añade un bien a un cliente (recibe 2 IDs: clienteId y bienId).
 */
export async function addBienToCliente(clienteId: string, bienId: string) {
  // Verifica que existan ambos
  const cliente = await Cliente.findById(clienteId);
  if (!cliente) throw new Error('Cliente no encontrado');
  
  const bien = await Bien.findById(bienId);
  if (!bien) throw new Error('Bien no encontrado');

  // Evita duplicados
  if (!cliente.bienes.includes(bienId)) {
    cliente.bienes.push(bienId);
    await cliente.save();
  }
  return cliente;
}

/**
 * Elimina un bien de un cliente (recibe 2 IDs: clienteId y bienId).
 */
export async function removeBienFromCliente(clienteId: string, bienId: string) {
  const cliente = await Cliente.findById(clienteId);
  if (!cliente) throw new Error('Cliente no encontrado');

  cliente.bienes = cliente.bienes.filter(b => b.toString() !== bienId);
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