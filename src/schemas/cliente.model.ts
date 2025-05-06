import { Document, Schema, model } from 'mongoose';

// Interfaz para el tipado del par bien-cantidad
export interface BienCantidad {
  bienId: string;
  cantidad: number;
}

// Interfaz para el tipado del cliente
export interface ClienteDocumentInterface extends Document {
  nombre: string;
  tipo: 'Cazador' | 'Brujo' | 'Noble' | 'Bandido' | 'Mercenario' | 'Aldeano';
  dinero: number;
  bienes: BienCantidad[];  // Cambiado de string[] a BienCantidad[]
  historia?: string;
}

// Validadores
const validadorDinero = (value: number) => value >= 0;
const validadorCantidad = (value: number) => value > 0;  // Validador para cantidad de bienes

// Esquema para BienCantidad
const BienCantidadSchema = new Schema<BienCantidad>({
  bienId: {
    type: String,
    required: true,
  },
  cantidad: {
    type: Number,
    required: true,
    validate: {
      validator: validadorCantidad,
      message: 'La cantidad debe ser mayor que cero.'
    }
  }
});

// Esquema del Cliente
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
    type: [BienCantidadSchema],  // Usamos el esquema definido arriba
    default: [],
  },
  historia: {
    type: String,
    required: false,
  },
});

// Modelo
export const Cliente = model<ClienteDocumentInterface>('Cliente', ClienteSchema);