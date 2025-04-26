import mongoose from 'mongoose';

const bienSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    unique: true,
  },
  descripcion: {
    type: String,
    required: true,
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

export const BienModel = mongoose.model('Bien', bienSchema);


// import mongoose from 'mongoose';

// const BienSchema = new mongoose.Schema({
//   idUnico: { type: String, required: true, unique: true },
//   nombre: { type: String, required: true },
//   descripcion: { type: String, required: true },
//   material: { type: String, required: true },
//   peso: { type: Number, required: true, min: 0 },
//   valorCoronas: { type: Number, required: true, min: 0 },
// });

// export const BienModel = mongoose.model('Bien', BienSchema);
