const Cart = require('../models/cart.model.js');

class CartDAO {
    async createCart() {
        return await Cart.create({ products: [] });
    }

    async getCartById(id) {
        return await Cart.findOne({ _id: id }).lean();
    }

    async addProductToCart(cartId, productId) {
        const cart = await Cart.findById(cartId);
        if (!cart) throw new Error('No se encuentra carrito');

        const productIndex = cart.products.findIndex(p => p.product.equals(productId));

        if (productIndex > -1) {
            cart.products[productIndex].quantity += 1;
        } else {
            cart.products.push({ product: productId, quantity: 1 });
        }
        return await cart.save();
    }

    async deleteProductFromCart(cartId, productId) {
        return await Cart.findByIdAndUpdate(
            cartId,
            { $pull: { products: { product: productId } } },
            { new: true }
        );
    }

    async updateCartProducts(cartId, productsArray) {
        return await Cart.findByIdAndUpdate(
            cartId,
            { products: productsArray },
            { new: true }
        );
    }

    async updateProductQuantity(cartId, productId, quantity) {
        if (quantity < 1) {
            return this.deleteProductFromCart(cartId, productId);
        }
        return await Cart.findOneAndUpdate(
            { _id: cartId, 'products.product': productId },
            { $set: { 'products.$.quantity': quantity } },
            { new: true }
        );
    }

    async deleteAllProducts(cartId) {
        return await Cart.findByIdAndUpdate(
            cartId,
            { products: [] },
            { new: true }
        );
    }
}

module.exports = CartDAO;