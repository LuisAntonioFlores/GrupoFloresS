import { connect } from "mongoose";

export async function startConnection() {
  try {
    await connect('mongodb://127.0.0.1:27017/FabricaDeBloc');
          useNewUrlParser: true;
          useFindAndModify: false;
          
    console.log('Database is connected');
  } catch (error) {
    console.error('Error connecting to the database:', error);
  }
}
