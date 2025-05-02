import { Schema, model, Document } from 'mongoose';

export interface TransaccionDocumentInterface extends Document {
  fecha: Date;
  clienteId: string;
  mercaderId: string;
  bienes: string[];
}

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
    type: [String],
    required: true,
  },
});

export const Transaccion = model<TransaccionDocumentInterface>('Transaccion', TransaccionSchema);