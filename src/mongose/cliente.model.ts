import mongoose from 'mongoose';

const ClienteSchema = new mongoose.Schema({
  idUnico: { type: String, required: true, unique: true },
  nombre: { type: String, required: true },
  raza: { type: String, required: true },
  ubicacion: { type: String, required: true },
});

export const ClienteModel = mongoose.model('Cliente', ClienteSchema);
