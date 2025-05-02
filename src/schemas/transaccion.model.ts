import { Schema, model, Document } from 'mongoose';

export interface TransaccionDocumentInterface extends Document {
  fecha: Date;
  cazadorId: string;
  mercaderId: string;
  bienes: { bienId: string; cantidad: number }[];
}

const TransaccionSchema = new Schema<TransaccionDocumentInterface>({
  fecha: {
    type: Date,
    default: Date.now,
  },
  cazadorId: {
    type: String,
    required: true,
  },
  mercaderId: {
    type: String,
    required: true,
  },
  bienes: [
    {
      bienId: {
        type: String,
        required: true,
      },
      cantidad: {
        type: Number,
        required: true,
        min: 1,
      },
    },
  ]
});

export const Transaccion = model<TransaccionDocumentInterface>('Transaccion', TransaccionSchema);