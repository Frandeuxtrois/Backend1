const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');

// importaciones para handlebars
const handlebars = require('express-handlebars');
const path = require('path');

//función de conexión a la db
const connectDB = require('./src/config/database.js');
const productsRouter = require('./src/routes/products.router.js');
const cartsRouter = require('./src/routes/carts.router.js');
const viewsRouter = require('./src/routes/views.router.js');
const app = express();
const httpServer = createServer(app); // se crea sv http
const io = new Server(httpServer); // se monta socket
const PORT = 8080;

// conexión a la base de datos
connectDB();

// config handlebars
app.engine(
  "hbs",
  handlebars.engine({
    extname: ".hbs",
    defaultLayout: "main",
  })
);
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "src", "views"));


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
    socket.on('disconnect', () => {
        console.log(`Cliente desconectado: ${socket.id}`);
    });
});

// inicio
// listen para que funcione socket correctamente
httpServer.listen(PORT, () => {
    console.log(`Servidor abierto en http://localhost:${PORT}`);
});