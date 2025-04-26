import mongoose from 'mongoose';

const MercaderSchema = new mongoose.Schema({
  idUnico: { type: String, required: true, unique: true },
  nombre: { type: String, required: true },
  tipo: { type: String, required: true },
  ubicacion: { type: String, required: true },
});

export const MercaderModel = mongoose.model('Mercader', MercaderSchema);
