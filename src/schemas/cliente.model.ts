import { Document, Schema, model } from 'mongoose';


// Interfaz para el tipado
export interface ClienteDocumentInterface extends Document {
  nombre: string;
  tipo: 'Cazador' | 'Brujo' | 'Noble' | 'Bandido' | 'Mercenario' | 'Aldeano';
  dinero: number;
  bienes: string[];
  historia?: string;
}

// Validadores
const validadorDinero = (value: number) => value >= 0;

// Esquema
const ClienteSchema = new Schema<ClienteDocumentInterface>({
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
  tipo: {
    type: String,
    required: true,
    enum: ['Cazador', 'Brujo', 'Noble', 'Bandido', 'Mercenario', 'Aldeano'],
  },
  dinero: {
    type: Number,
    required: true,
    validate: {
      validator: validadorDinero,
      message: 'El dinero no puede ser negativo.',
    },
  },
  bienes: {
    type: [String],
    default: [],
  },
  historia: {
    type: String,
    required: false,
  },
});

// Modelo
export const Cliente = model<ClienteDocumentInterface>('Cliente', ClienteSchema);