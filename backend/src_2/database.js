const mongoose = require("mongoose");

async function startConnection() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/FabricaDeBloc', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Database is connected');
  } catch (error) {
    console.error('Error connecting to the database:', error);
  }
}

module.exports = { startConnection };
