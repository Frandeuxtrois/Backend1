const { Router } = require('express');
const ProductDAO = require('../dao/ProductDAO.js');
const CartDAO = require('../dao/CartDAO.js');

const router = Router();
const productDAO = new ProductDAO();
const cartDAO = new CartDAO();

router.get('/products', async (req, res) => {
    try {
        const { limit = 10, page = 1, sort, query } = req.query;
        const result = await productDAO.getProducts({ limit, page, sort, query });
        const productsDataForView = {
            payload: result.docs,
            totalPages: result.totalPages,
            page: result.page,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevLink: result.hasPrevPage ? `/products?page=${result.prevPage}&limit=${result.limit}` : null,
            nextLink: result.hasNextPage ? `/products?page=${result.nextPage}&limit=${result.limit}` : null,
        };

        res.render('products', productsDataForView);
    } catch (error) {
        res.status(500).send('error al obtener productos');
    }
});

router.get('/carts/:cid', async (req, res) => {
    try {
        const cart = await cartDAO.getCartById(req.params.cid);
        res.render('cart', { cart });
    } catch (error) {
        res.status(500).send('error al obtener carrito');
    }
});

router.get('/products/:pid', async (req, res) => {
    try {
        const product = await productDAO.getProductById(req.params.pid);
        if (!product) {
            return res.status(404).send('no se encontro producto');
        }
        res.render('productDetail', { product });
    } catch (error) {
        res.status(500).send('error al obtener el detalle ');
    }
});

module.exports = router;