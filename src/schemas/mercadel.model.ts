import { Document, Schema, model } from 'mongoose';

export interface MerchantDocumentInterface extends Document {
  nombre: string;
  tienda: string;
  ubicacion: string;
  especialidad: string;
  reputacion: number;
  inventario?: string[];
}

const MerchantSchema = new Schema<MerchantDocumentInterface>({
  nombre: {
    type: String,
    required: true,
    trim: true,
    validate: (value: string) => {
      if (!value.match(/^[A-Z]/)) {
        throw new Error('El nombre debe empezar con mayúscula.');
      }
    },
  },
  tienda: {
    type: String,
    required: true,
    trim: true
  },
  ubicacion: {
    type: String,
    required: true,
    enum: ['Novigrado', 'Oxenfurt', 'Velen', 'Skellige', 'Toussaint']
  },
  especialidad: {
    type: String,
    required: true,
    enum: ['Armas', 'Armaduras', 'Pociones', 'Ingredientes', 'Libros', 'Miscelánea']
  },
  reputacion: {
    type: Number,
    required: true,
    min: [1, 'La reputación mínima es 1'],
    max: [5, 'La reputación máxima es 5']
  },
  inventario: {
    type: [String],
    default: []
  }
});

export const Merchant = model<MerchantDocumentInterface>('Merchant', MerchantSchema);