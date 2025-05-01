import { Transaccion } from '../schemas/transaccion.model.js';
import { Cliente } from '../schemas/cliente.model.js';
import { Merchant } from '../schemas/mercadel.model.js';
import { Bien } from '../schemas/bien.model.js';

/**
 * Crea una nueva transacción.
 */
export async function crearTransaccion(data: {
  tipo: 'venta' | 'compra';
  cazadorId?: string;
  mercaderId?: string;
  bienes: { bienId: string; cantidad: number }[];
}) {
  const { tipo, cazadorId, mercaderId, bienes } = data;

  // Verificar existencia de cazador o mercader
  if (tipo === 'venta' && !(await Cliente.findById(cazadorId))) {
    throw new Error('El cazador no existe.');
  }
  if (tipo === 'compra' && !(await Merchant.findById(mercaderId))) {
    throw new Error('El mercader no existe.');
  }

  // Verificar existencia de bienes y calcular total
  let total = 0;
  for (const { bienId, cantidad } of bienes) {
    const bien = await Bien.findById(bienId);
    if (!bien) throw new Error(`El bien con ID ${bienId} no existe.`);
    total += bien.valor * cantidad;
  }

  // Crear la transacción
  const transaccion = new Transaccion({
    tipo,
    cazadorId,
    mercaderId,
    bienes,
    total,
  });

  return await transaccion.save();
}

/**
 * Obtiene transacciones por filtros.
 */
export async function obtenerTransacciones(query: {
  cazadorId?: string;
  mercaderId?: string;
  fechaInicio?: Date;
  fechaFin?: Date;
}) {
  const filtros: any = {};
  if (query.cazadorId) filtros.cazadorId = query.cazadorId;
  if (query.mercaderId) filtros.mercaderId = query.mercaderId;
  if (query.fechaInicio || query.fechaFin) {
    filtros.fecha = {};
    if (query.fechaInicio) filtros.fecha.$gte = query.fechaInicio;
    if (query.fechaFin) filtros.fecha.$lte = query.fechaFin;
  }

  return await Transaccion.find(filtros);
}

/**
 * Elimina una transacción por ID.
 */
export async function eliminarTransaccion(id: string) {
  return await Transaccion.findByIdAndDelete(id);
}