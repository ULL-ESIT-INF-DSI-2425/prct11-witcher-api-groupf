import { Schema, model, Document } from 'mongoose';
import { BienCantidad } from './cliente.model.js';

/**
 * Interfaz que representa un documento de Transacción en la base de datos.
 * Extiende la interfaz Document de Mongoose para incluir métodos específicos.
 */
export interface TransaccionDocumentInterface extends Document {
  fecha: Date;
  clienteId: string;
  mercaderId: string;
  bienes: BienCantidad[];  
}

/**
 * Esquema de Mongoose para el modelo Transacción.
 * Define la estructura, validaciones y configuraciones de los documentos Transacción.
 */
const BienTransaccionSchema = new Schema<BienCantidad>({
  bienId: {
    type: String,
    required: true,
  },
  cantidad: {
    type: Number,
    required: true,
    min: [1, 'La cantidad debe ser al menos 1']
  }
});

/**
 * Esquema de Mongoose para el modelo Transacción.
 * Define la estructura, validaciones y configuraciones de los documentos Transacción.
 */
const TransaccionSchema = new Schema<TransaccionDocumentInterface>({
  fecha: {
    type: Date,
    default: Date.now,
  },
  clienteId: {
    type: String,
    required: true,
  },
  mercaderId: {
    type: String,
    required: true,
  },
  bienes: {
    type: [BienTransaccionSchema],  // Usamos el esquema definido arriba
    required: true,
  }
});

/**
 * Modelo de Mongoose para la colección de Transacciones.
 * Proporciona métodos para interactuar con la colección en la base de datos.
 */
export const Transaccion = model<TransaccionDocumentInterface>('Transaccion', TransaccionSchema);