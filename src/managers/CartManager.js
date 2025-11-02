const fs = require('fs/promises');
const crypto = require('crypto');

class CartManager {
    constructor(path) {
        this.path = path;
    }

    //funcion para leer los carritos
    async readCarts() {
        try {
            const data = await fs.readFile(this.path, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            return [];
        }
    }

    //funcion para escribir los carritos
    async writeCarts(carts) {
        await fs.writeFile(this.path, JSON.stringify(carts, null, 2));
    }

    // Crear un carrito nuevo
    async createCart() {
        const carts = await this.readCarts();
        const newCart = {
            id: crypto.randomUUID(),
            products: []
        };
        carts.push(newCart);
        await this.writeCarts(carts);
        return newCart;
    }

    // Obtener carrito por ID
    async getCartById(id) {
        const carts = await this.readCarts();
        const cart = carts.find(c => c.id === id);
        if (!cart) {
            console.log("carrito no encontrado.");
            return null;
        }
        return cart;
    }

    //agregar un producto a un carrito
    async addProductToCart(cartId, productId) {
        const carts = await this.readCarts();
        const cartIndex = carts.findIndex(c => c.id === cartId);

        if (cartIndex === -1) {
            console.log("error: Carrito no encontrado.");
            return null;
        }

        const productInCart = carts[cartIndex].products.find(p => p.product === productId);

        if (productInCart) {
            productInCart.quantity++;
        } else {
            carts[cartIndex].products.push({ product: productId, quantity: 1 });
        }

        await this.writeCarts(carts);
        return carts[cartIndex];
    }
}

module.exports = CartManager;