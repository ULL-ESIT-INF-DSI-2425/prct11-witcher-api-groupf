import { Schema, model, Document } from 'mongoose';
import { BienCantidad } from './cliente.model.js';

export interface TransaccionDocumentInterface extends Document {
  fecha: Date;
  clienteId: string;
  mercaderId: string;
  bienes: BienCantidad[];  // Cambiado de string[] a BienTransaccion[]
}

// Esquema para BienTransaccion
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

export const Transaccion = model<TransaccionDocumentInterface>('Transaccion', TransaccionSchema);