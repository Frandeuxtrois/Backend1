const { Router } = require('express');
const ProductManager = require('../managers/ProductManager');

const router = Router();
const productManager = new ProductManager('src/data/products.json');

//recibir todos los productos
router.get('/', async (req, res) => {
    try {
        const products = await productManager.getProducts();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: "Error del servidor" });
    }
});

//recibir por id
router.get('/:pid', async (req, res) => {
    try {
        const product = await productManager.getProductById(req.params.pid);
        res.status(200).json(product);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

// Crear producto
router.post('/', async (req, res) => {
    try {
        const newProduct = await productManager.addProduct(req.body);
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// actualizar el campo
router.put('/:pid', async (req, res) => {
    try {
        const updatedProduct = await productManager.updateProduct(req.params.pid, req.body);
        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

// eliminar x id
router.delete('/:pid', async (req, res) => {
    try {
        await productManager.deleteProduct(req.params.pid);
        res.status(200).json({ message: 'Producto eliminado.' });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

module.exports = router;