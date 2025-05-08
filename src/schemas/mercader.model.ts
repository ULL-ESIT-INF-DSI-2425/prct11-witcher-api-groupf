import { Document, Schema, model } from 'mongoose';
import { BienCantidad } from './cliente.model.js';

/**
 * Interfaz que representa un documento de Mercader en la base de datos.
 * Extiende la interfaz Document de Mongoose para incluir métodos específicos.
 */
export interface MercaderDocumentInterface extends Document {
  nombre: string;
  tienda: string;
  ubicacion: string;
  especialidad: string;
  reputacion: number;
  dinero: number;
  inventario: BienCantidad[];  
}

/**
 * Esquema de Mongoose para el modelo BienCantidad.
 * Define la estructura, validaciones y configuraciones de los documentos BienCantidad.
 */
const BienCantidadSchema = new Schema<BienCantidad>({
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

/**
 * Esquema de Mongoose para el modelo Mercader.
 * Define la estructura, validaciones y configuraciones de los documentos Mercader.
 */
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
    type: [BienCantidadSchema],  // Usamos el esquema definido arriba
    default: []
  }
});

/**
 * Modelo de Mongoose para la colección de Mercaderes.
 * Proporciona métodos para interactuar con la colección en la base de datos.
 */
export const Mercader = model<MercaderDocumentInterface>('Mercader', MercaderSchema);