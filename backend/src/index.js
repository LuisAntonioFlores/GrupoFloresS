// Importamos App y startConnection
const { app, server, } = require('./app');
const { startConnection } = require('./database');

// Función principal
async function main() {
  // Llamamos a startConnection
  startConnection();

  // Esperamos a que la aplicación escuche en el puerto definido
  try {
    // Espera a que la aplicación escuche en el puerto definido
    await server.listen(app.get('port'));
    console.log('Servidor corriendo en el puerto', app.get('port'));
} catch (error) {
    console.error('Error al iniciar la aplicación:', error);
    process.exit(1);
}
}

// Llamamos a la función principal
main();
