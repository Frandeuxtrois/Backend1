const { Router } = require('express');
const productController = require('../controllers/products.controller.js');

const router = Router();

// define ruta y asigna metodo para controlador
router.get('/', productController.getProducts);
router.get('/:pid', productController.getProductById);
router.post('/', productController.addProduct);
router.put('/:pid', productController.updateProduct);
router.delete('/:pid', productController.deleteProduct);

module.exports = router;