import { Cliente } from '../schemas/cliente.model.js';
import { connect, disconnect } from 'mongoose';

const uri = 'mongodb://127.0.0.1:27017/fantasy-db';

/**
 * Crea un nuevo cliente.
 * @param clienteData Datos del cliente.
 */
export function crearCliente(clienteData: {
  nombre: string;
  tipo: string;
  dinero: number;
  bienes?: string[];
  historia?: string;
}) {
  return connect(uri)
    .then(() => {
      const cliente = new Cliente(clienteData);
      return cliente.save();
    })
    .then((clienteGuardado) => {
      return disconnect().then(() => clienteGuardado);
    })
    .catch((error) => {
      disconnect();
      throw error;
    });
}

/**
 * Busca un cliente por nombre o ID.
 * @param query Nombre o ID del cliente.
 */
export function buscarCliente(query: string) {
  return connect(uri)
    .then(() => {
      if (query.match(/^[0-9a-fA-F]{24}$/)) {
        return Cliente.findById(query);
      } else {
        return Cliente.findOne({ nombre: query });
      }
    })
    .then((cliente) => {
      return disconnect().then(() => cliente);
    })
    .catch((error) => {
      disconnect();
      throw error;
    });
}


/**
 * Elimina un cliente por nombre o ID.
 * @param query Nombre o ID del cliente.
 */
export function eliminarCliente(query: string) {
    return connect(uri)
      .then(() => {
        if (query.match(/^[0-9a-fA-F]{24}$/)) {
          return Cliente.findByIdAndDelete(query);
        } else {
          return Cliente.findOneAndDelete({ nombre: query });
        }
      })
      .then((clienteEliminado) => {
        return disconnect().then(() => clienteEliminado);
      })
      .catch((error) => {
        disconnect();
        throw error;
      });
  }


/**
 * Obtiene todos los clientes.
 */
export function listarClientes() {
    return connect(uri)
      .then(() => Cliente.find({}))
      .then((clientes) => {
        return disconnect().then(() => clientes);
      })
      .catch((error) => {
        disconnect();
        throw error;
      });
  }

/**
 * Actualiza un cliente por nombre o ID.
 */
export function actualizarCliente(query: string, actualizacion: any) {
    return connect(uri)
      .then(() => {
        if (query.match(/^[0-9a-fA-F]{24}$/)) {
          return Cliente.findByIdAndUpdate(query, actualizacion, { new: true });
        } else {
          return Cliente.findOneAndUpdate({ nombre: query }, actualizacion, { new: true });
        }
      })
      .then((clienteActualizado) => {
        return disconnect().then(() => clienteActualizado);
      })
      .catch((error) => {
        disconnect();
        throw error;
      });
  }

  /**
 * Añade un bien a un cliente por nombre o ID.
 */
export function anadirBienACliente(query: string, bien: string) {
    return connect(uri)
      .then(() => {
        if (query.match(/^[0-9a-fA-F]{24}$/)) {
          return Cliente.findByIdAndUpdate(query, { $addToSet: { bienes: bien } }, { new: true });
        } else {
          return Cliente.findOneAndUpdate({ nombre: query }, { $addToSet: { bienes: bien } }, { new: true });
        }
      })
      .then((clienteActualizado) => {
        return disconnect().then(() => clienteActualizado);
      })
      .catch((error) => {
        disconnect();
        throw error;
      });
  }

/**
 * Elimina un bien de un cliente por nombre o ID.
*/
export function eliminarBienDeCliente(query: string, bien: string) {
    return connect(uri)
      .then(() => {
        if (query.match(/^[0-9a-fA-F]{24}$/)) {
          return Cliente.findByIdAndUpdate(query, { $pull: { bienes: bien } }, { new: true });
        } else {
          return Cliente.findOneAndUpdate({ nombre: query }, { $pull: { bienes: bien } }, { new: true });
        }
      })
      .then((clienteActualizado) => {
        return disconnect().then(() => clienteActualizado);
      })
      .catch((error) => {
        disconnect();
        throw error;
      });
  }

/**
 * Actualiza el dinero de un cliente por nombre o ID, cuando compra un bien.
 */
  // hacer
