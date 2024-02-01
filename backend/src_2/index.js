// Importamos App y startConnection
const app = require('./app');
const { startConnection } = require('./database');

// Función principal
async function main() {
  // Llamamos a startConnection
  startConnection();

  // Esperamos a que la aplicación escuche en el puerto definido
  await app.listen(app.get('port'));

  // Imprimimos un mensaje indicando que el servidor está corriendo
  console.log('Servidor corriendo en el puerto', app.get('port'));
}

// Llamamos a la función principal
main();
