const express = require('express');
const productsRouter = require('./routes/products.router.js');
const cartsRouter = require('./routes/carts.router.js');

const app = express();
const PORT = 8080;

// recibir y leer json peticiones
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// conectar a rutas base
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

// inicio
app.listen(PORT, () => {
    console.log(`Servidor abierto en http://localhost:${PORT}`);
});