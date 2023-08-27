const express = require ('express');
const app = express();
const cors = require('cors');
const verifyEmailRouter = require('./routes/verifyEmail');
const verifyInicioRouter = require('./routes/VerifyInicio');
const productRoutes = require('./routes/product');
require('./database');

app.use(cors());
app.use(express.json());
app.use('/api/productos', productRoutes);

app.use('/api/verify-inicio', verifyInicioRouter);
app.use('/api/verify-email', verifyEmailRouter);
app.use('/api', require('./routes/index.js'));

app.listen(3000);
console.log('Server on port', 3000);

