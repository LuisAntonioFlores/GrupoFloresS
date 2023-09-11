// arrancar aplicacion
import app, {} from './app';    // importamos App
import{startConnection} from './database'; // importamos startConnection

async function main() {        // funcion principal
  startConnection();           // llamamos a startConnection  
  await app.listen(app.get('port')); 
    console.log('Servidor corriendo en el puerto', app.get('port'));
  // arrancamos app
  }
main();
