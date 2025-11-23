const { Router } = require('express');
const ProductManager = require('../managers/ProductManager.js');

const router = Router();
const productManager = new ProductManager('src/data/products.json');

// ruta vista home.handlebars
router.get('/', async (req, res) => {
    try {
        const products = await productManager.getProducts();
        res.render('home', { products });
    } catch (error) {
        res.status(500).send('hubo un problema al cargar productos');
    }
});

// ruta para la realTimeProducts.handlebars
router.get('/realtimeproducts', async (req, res) => {
    try {
        // recibimos los productos
        const products = await productManager.getProducts();
        res.render('realTimeProducts', { products });
    } catch (error) {
        res.status(500).send('hubo un error al cargar la vista en tiempo real');
    }
});

module.exports = router;