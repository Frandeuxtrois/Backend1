const CartDAO = require('../dao/CartDAO.js');
const cartDAO = new CartDAO();

class CartController {
    async createCart(req, res) {
        try {
            res.status(201).json(await cartDAO.createCart());
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getCartById(req, res) {
        try {
            res.json(await cartDAO.getCartById(req.params.cid));
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    }

    async addProductToCart(req, res) {
        try {
            const { cid, pid } = req.params;
            res.json(await cartDAO.addProductToCart(cid, pid));
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async deleteProductFromCart(req, res) {
        try {
            const { cid, pid } = req.params;
            res.json(await cartDAO.deleteProductFromCart(cid, pid));
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async updateCartProducts(req, res) {
        try {
            res.json(await cartDAO.updateCartProducts(req.params.cid, req.body.products));
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async updateProductQuantity(req, res) {
        try {
            const { cid, pid } = req.params;
            res.json(await cartDAO.updateProductQuantity(cid, pid, req.body.quantity));
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async deleteAllProducts(req, res) {
        try {
            res.json(await cartDAO.deleteAllProducts(req.params.cid));
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new CartController();