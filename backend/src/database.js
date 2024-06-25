// const mongoose = require("mongoose");

// async function startConnection() {
//   try {
//     await mongoose.connect('mongodb://127.0.0.1:27017/FabricaDeBloc', {
//       useNewUrlParser: true,
//       useUnifiedTopology: true
//     });
//     console.log('Database is connected');
//   } catch (error) {
//     console.error('Error connecting to the database:', error);
//   }
// }
// Importa dotenv y configúralo para cargar las variables de entorno del archivo .env
require('dotenv').config();

const mongoose = require('mongoose');

async function startConnection() {
  try {
    // Conectar a MongoDB utilizando la variable de entorno MONGODB_URI
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Conexión exitosa a la base de datos de MongoDB Atlas');
  } catch (error) {
    console.error('Error al conectar a la base de datos:', error);
  }
}

module.exports = { startConnection };
