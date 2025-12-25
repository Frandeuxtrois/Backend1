const { Router } = require('express');
const cartController = require('../controllers/carts.controller.js');

const router = Router();

router.post('/', cartController.createCart);
router.get('/:cid', cartController.getCartById);
router.post('/:cid/products/:pid', cartController.addProductToCart);
router.put('/:cid', cartController.updateCartProducts);
router.put('/:cid/products/:pid', cartController.updateProductQuantity);
router.delete('/:cid', cartController.deleteAllProducts);
router.delete('/:cid/products/:pid', cartController.deleteProductFromCart);

module.exports = router;