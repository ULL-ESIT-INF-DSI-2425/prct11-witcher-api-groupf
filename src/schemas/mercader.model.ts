import { Document, Schema, model } from 'mongoose';

export interface MercaderDocumentInterface extends Document {
  nombre: string;
  tienda: string;
  ubicacion: string;
  especialidad: string;
  reputacion: number;
  dinero: number;
  inventario: string[];
}

const MercaderSchema = new Schema<MercaderDocumentInterface>({
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
  dinero: {
    type: Number,
    required: true,
    min: [0, 'El dinero no puede ser negativo']
  },
  inventario: {
    type: [String],
    default: []
  }
});

export const Mercader = model<MercaderDocumentInterface>('Mercader', MercaderSchema);
