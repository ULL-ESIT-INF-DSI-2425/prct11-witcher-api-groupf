import { Document, Schema, model } from 'mongoose';

/**
 * Interfaz que representa la cantidad de un bien específico.
 */
export interface BienCantidad {
  bienId: string;
  cantidad: number;
}

/**
 * Interfaz que representa un documento de Cliente en la base de datos.
 * Extiende la interfaz Document de Mongoose para incluir métodos específicos.
 */
export interface ClienteDocumentInterface extends Document {
  nombre: string;
  tipo: 'Cazador' | 'Brujo' | 'Noble' | 'Bandido' | 'Mercenario' | 'Aldeano';
  dinero: number;
  bienes: BienCantidad[];  
  historia?: string;
}

// Validadores
const validadorDinero = (value: number) => value >= 0;
const validadorCantidad = (value: number) => value > 0;  


/**
 * Esquema de Mongoose para la cantidad de un bien específico.
 * Define la estructura y validaciones de los documentos de BienCantidad.
 */
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

/**
 * Esquema de Mongoose para el modelo Cliente.
 * Define la estructura, validaciones y configuraciones de los documentos Cliente.
 */
const ClienteSchema = new Schema<ClienteDocumentInterface>({
  nombre: {
    type: String,
    required: true,
    trim: true,
    unique: true,
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

/**
 * Modelo de Mongoose para la colección de Clientes.
 * Proporciona métodos para interactuar con la colección en la base de datos.
 */
export const Cliente = model<ClienteDocumentInterface>('Cliente', ClienteSchema);