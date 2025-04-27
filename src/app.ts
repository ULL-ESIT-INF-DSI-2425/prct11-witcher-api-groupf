import {
  crearCliente,
  buscarCliente,
  eliminarCliente,
  listarClientes,
  actualizarCliente
} from './functions/cliente.functions.js';

console.log('🚀 Iniciando flujo de clientes...');

// 1. Crear Geralt
const crearGeralt = new Promise((resolve, reject) => {
  crearCliente({
    nombre: 'Geralt',
    tipo: 'Cazador',
    dinero: 500,
    bienes: ['espada_plateada'],
    historia: 'Cazador de monstruos de Rivia.'
  })
  .then(resolve)
  .catch(reject);
});

// 2. Crear Yennefer (después de Geralt)
const crearYennefer = crearGeralt.then(() => {
  return new Promise((resolve, reject) => {
    crearCliente({
      nombre: 'Yennefer',
      tipo: 'Noble',
      dinero: 1000,
      bienes: ['amuletos', 'pociones'],
      historia: 'Hechicera poderosa de Vengerberg.'
    })
    .then(resolve)
    .catch(reject);
  });
});

// 3. Listar clientes (después de crear ambos)
const listarInicial = crearYennefer.then(() => {
  return new Promise((resolve, reject) => {
    listarClientes()
    .then(resolve)
    .catch(reject);
  });
});

// 4. Buscar y eliminar Geralt
const eliminarGeralt = listarInicial.then(() => {
  return new Promise((resolve, reject) => {
    buscarCliente('Geralt')
    .then((cliente) => {
      if (!cliente) throw new Error('Geralt no encontrado');
      return eliminarCliente(cliente.id);
    })
    .then(resolve)
    .catch(reject);
  });
});

// 5. Listar después de eliminar
const listarSinGeralt = eliminarGeralt.then(() => {
  return new Promise((resolve, reject) => {
    listarClientes()
    .then(resolve)
    .catch(reject);
  });
});

// 6. Actualizar Yennefer
const actualizarYen = listarSinGeralt.then(() => {
  return new Promise((resolve, reject) => {
    buscarCliente('Yennefer')
    .then((cliente) => {
      if (!cliente) throw new Error('Yennefer no encontrada');
      return actualizarCliente(cliente.id, { dinero: 2000 });
    })
    .then(resolve)
    .catch(reject);
  });
});

// 7. Listar final
const listarFinal = actualizarYen.then(() => {
  return new Promise((resolve, reject) => {
    listarClientes()
    .then(resolve)
    .catch(reject);
  });
});

// Manejo centralizado de resultados/errores
Promise.all([
  crearGeralt,
  crearYennefer,
  listarInicial,
  eliminarGeralt,
  listarSinGeralt,
  actualizarYen,
  listarFinal
])
.then((results) => {
  console.log('✅ Flujo completado:');
  console.log('1. Geralt creado:', results[0]);
  console.log('2. Yennefer creada:', results[1]);
  console.log('3. Lista inicial:', results[2]);
  console.log('4. Geralt eliminado:', results[3]);
  console.log('5. Lista sin Geralt:', results[4]);
  console.log('6. Yennefer actualizada:', results[5]);
  console.log('7. Lista final:', results[6]);
})
.catch((error) => {
  console.error('❌ Error:', error.message);
});