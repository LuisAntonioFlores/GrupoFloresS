// servidor 
import express from 'express';  // importamos express
import morgan from 'morgan';    // importamos morgan
const app = express(); // instanciamos express
import indexRoutes from './routes/index'; // importamos indexRoutes      
import path from 'path'; // importamos path
import cors from 'cors';
// configuracion
app.set('port', process.env.PORT || 4000); // puerto
// middlewares
app.use(morgan('dev1')); // morgan 

app.use(cors());

app.use(express.json()); // para que express entienda json  

// routes
app.use('/api',indexRoutes); // rutas 
app.use('/uploads', express.static(path.resolve('uploads'))); // para que se pueda acceder a la carpeta uploads desde el navegador      
// exportamos app
export default app; 
 