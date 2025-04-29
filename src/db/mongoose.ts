import { connect } from 'mongoose';

const connectionString = 'mongodb://127.0.0.1:27017/WitcherAPI_DB';

connect(connectionString).then(() => {
  console.log('===> Conexión establecida con MongoDB <===');
}).catch((error) => {
  console.error('### Error al conectar con MongoDB:', error);
});