const { Router } = require('express');
const CartManager = require('../managers/CartManager');

const router = Router();
const cartManager = new CartManager('src/data/carts.json');

//crear elnuevo carrito
router.post('/', async (req, res) => {
    try {
        const newCart = await cartManager.createCart();
        res.status(201).json(newCart);
    } catch (error) {
        res.status(500).json({ error: "Error del servidor" });
    }
});

//recibir todos los productos del carrito
router.get('/:cid', async (req, res) => {
    try {
        const cart = await cartManager.getCartById(req.params.cid);
        res.status(200).json(cart.products);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

//agregar producto al carrito
router.post('/:cid/product/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    try {
        const updatedCart = await cartManager.addProductToCart(cid, pid);
        res.status(200).json(updatedCart);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

module.exports = router;