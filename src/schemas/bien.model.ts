import { Schema, model, Document } from 'mongoose';

/**
 * Interfaz que representa un documento de Bien en la base de datos.
 * Extiende la interfaz Document de Mongoose para incluir métodos específicos.
 */
export interface BienDocumentInterface extends Document {
  nombre: string;
  descripcion: string;
  valor: number;
  tipo: 'arma' | 'armadura' | 'pocion' | 'herramienta' | 'otro';
}

/**
 * Esquema de Mongoose para el modelo Bien.
 * Define la estructura, validaciones y configuraciones de los documentos Bien.
 */
const BienSchema = new Schema<BienDocumentInterface>({
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

/**
 * Modelo de Mongoose para la colección de Bienes.
 * Proporciona métodos para interactuar con la colección en la base de datos.
 */
export const Bien = model<BienDocumentInterface>('Bien', BienSchema);
