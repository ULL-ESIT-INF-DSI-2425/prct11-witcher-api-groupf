import { Schema, model, Document } from 'mongoose';

export interface TransaccionDocumentInterface extends Document {
  tipo: 'venta' | 'compra';
  fecha: Date;
  cazadorId?: string;
  mercaderId?: string;
  bienes: { bienId: string; cantidad: number }[];
  total: number;
}

const TransaccionSchema = new Schema<TransaccionDocumentInterface>({
  tipo: {
    type: String,
    enum: ['venta', 'compra'],
    required: true,
  },
  fecha: {
    type: Date,
    default: Date.now,
  },
  cazadorId: {
    type: String,
    required: function () {
      return this.tipo === 'venta';
    },
  },
  mercaderId: {
    type: String,
    required: function () {
      return this.tipo === 'compra';
    },
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
  ],
  total: {
    type: Number,
    required: true,
    min: 0,
  },
});

export const Transaccion = model<TransaccionDocumentInterface>('Transaccion', TransaccionSchema);