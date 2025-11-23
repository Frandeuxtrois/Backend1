const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');

// importaciones para handlebars
const handlebars = require('express-handlebars');
const path = require('path');
const productsRouter = require('./routes/products.router.js');
const cartsRouter = require('./routes/carts.router.js');
const viewsRouter = require('./routes/views.router.js');

//clase ProductManager
const ProductManager = require('./managers/ProductManager.js');

const app = express();
const httpServer = createServer(app); // se crea sv http
const io = new Server(httpServer); // se monta socket
const PORT = 8080;
const productManager = new ProductManager('src/data/products.json'); //  product manager

// config handlebars
app.engine(
  "hbs",
  handlebars.engine({
    extname: ".hbs",
    defaultLayout: "main",
    partialsDir: path.join(__dirname, "views", "partials"),
  })
);
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));

// middlewares
// recibir y leer json peticiones
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// static js para clientes
app.use(express.static(path.join(__dirname, 'public')));

// para que los routers puedan usar socket.io ---
app.use((req, res, next) => {
    req.io = io;
    next();
});

// se terminan middlewares

// conectar a rutas base ( se actualiza)
app.use('/', viewsRouter);
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

// aca comenzamos con socket.io 
io.on('connection', (socket) => {
    console.log(`Cliente conectado: ${socket.id}`);

    // c rear un producto
    socket.on('client:newProduct', async (productData) => {
        try {
            //agregar el producto
            await productManager.addProduct(productData);
            // recibimos la lista actualizada
            const products = await productManager.getProducts();
            // enviar la lista actualizada
            io.emit('server:updateProducts', products);
        } catch (error) {
            console.error("error al agregar", error.message);
        }
    });

    // eliminar un producto
    socket.on('client:deleteProduct', async (productId) => {
        try {
            await productManager.deleteProduct(productId);
            const products = await productManager.getProducts();
            io.emit('server:updateProducts', products);
        } catch (error) {
            console.error("error al eliminar", error.message);
        }
    });
});

// inicio
// listen para que funcione socket correctamente
httpServer.listen(PORT, () => {
    console.log(`Servidor abierto en http://localhost:${PORT}`);
});