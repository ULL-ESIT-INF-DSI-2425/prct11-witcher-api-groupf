import { Schema, model, Document } from 'mongoose';

export interface BienDocumentInterface extends Document {
  idUnico: string;
  nombre: string;
  descripcion: string;
  valor: number;
  tipo: 'arma' | 'armadura' | 'pocion' | 'herramienta' | 'otro';
}

const BienSchema = new Schema<BienDocumentInterface>({
  idUnico: {
    type: String,
    required: true,
    unique: true,
  },
  nombre: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  descripcion: {
    type: String,
    required: true,
    trim: true,
  },
  valor: {
    type: Number,
    required: true,
    min: 0,
  },
  tipo: {
    type: String,
    enum: ['arma', 'armadura', 'pocion', 'herramienta', 'otro'],
    required: true,
  },
});

export const Bien = model<BienDocumentInterface>('Bien', BienSchema);
