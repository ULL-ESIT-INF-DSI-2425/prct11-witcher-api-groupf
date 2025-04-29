import { Cliente } from '../schemas/cliente.model.js';


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
