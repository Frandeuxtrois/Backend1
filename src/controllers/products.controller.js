const ProductDAO = require('../dao/ProductDAO.js');
const productDAO = new ProductDAO();

class ProductController {
    // Productos (con paginacion)
    async getProducts(req, res) {
        try {
            const { limit = 10, page = 1, sort, query } = req.query;
            const result = await productDAO.getProducts({ limit, page, sort, query });
            
            const baseUrl = `${req.protocol}://${req.get('host')}/products`;
            const response = {
                status: 'success',
                payload: result.docs,
                totalPages: result.totalPages,
                prevPage: result.prevPage,
                nextPage: result.nextPage,
                page: result.page,
                hasPrevPage: result.hasPrevPage,
                hasNextPage: result.hasNextPage,
                prevLink: result.hasPrevPage ? `${baseUrl}?page=${result.prevPage}&limit=${result.limit}` : null,
                nextLink: result.hasNextPage ? `${baseUrl}?page=${result.nextPage}&limit=${result.limit}` : null,
            };
            
            res.json(response);
        } catch (error) {
            res.status(500).json({ status: 'error', error: error.message });
        }
    }

    // obtener por id
    async getProductById(req, res) {
        try {
            const product = await productDAO.getProductById(req.params.pid);
            if (!product) {
                return res.status(404).json({ error: "Producto no encontrado" });
            }
            res.json(product);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // agregar producto
    async addProduct(req, res) {
        try {
            const newProduct = await productDAO.addProduct(req.body);
            // Notificamos a todos los clientes de WebSocket
            req.io.emit('updateProducts', await productDAO.getProducts({}));
            res.status(201).json(newProduct);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    // actualizar producto
    async updateProduct(req, res) {
        try {
            const updatedProduct = await productDAO.updateProduct(req.params.pid, req.body);
            if (!updatedProduct) {
                return res.status(404).json({ error: "Producto no encontrado para actualizar" });
            }
            // Notificamos a todos los clientes de WebSocket
            req.io.emit('updateProducts', await productDAO.getProducts({}));
            res.json(updatedProduct);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // eliminar producto
    async deleteProduct(req, res) {
        try {
            const result = await productDAO.deleteProduct(req.params.pid);
            if (!result) {
                return res.status(404).json({ error: "Producto no encontrado para eliminar" });
            }
            // Notificacion con websocket
            req.io.emit('updateProducts', await productDAO.getProducts({}));
            res.json({ message: 'Producto eliminado.' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new ProductController();