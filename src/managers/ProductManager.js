const fs = require('fs/promises');
const crypto = require('crypto');

class ProductManager {
    constructor(path) {
        this.path = path;
    }

    // Una función simple para leer el archivo
    async readProducts() {
        try {
            const data = await fs.readFile(this.path, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
    if (error.code === "ENOENT") {
        return [];
    }

    throw error;
}
    }

    //funcion para escribir en el archivo
    async writeProducts(products) {
        await fs.writeFile(this.path, JSON.stringify(products, null, 2));
    }

    // Obtener productos
    async getProducts() {
        const products = await this.readProducts();
        return products;
    }

    // Agregar uno
    async addProduct(productData) {
        const products = await this.readProducts();
        if (!productData.title || !productData.description || !productData.price || !productData.code || !productData.stock || !productData.category) {
            console.log("Todos los campos son obligatorios");
            return;
        }

        // 3. Crear nuevo producto con ID unico
        const newProduct = {
            id: crypto.randomUUID(),
            title: productData.title,
            description: productData.description,
            price: productData.price,
            thumbnails: productData.thumbnails || [],
            code: productData.code,
            stock: productData.stock,
            status: true,
            category: productData.category
        };

        products.push(newProduct);
        await this.writeProducts(products);
        return newProduct;
    }

    //obtener producto por ID
    async getProductById(id) {
        const products = await this.readProducts();
        const product = products.find(p => p.id === id);

        if (!product) {
            console.log("producto no se encuentra.");
            return null;
        }
        return product;
    }

    //actualizar prodducto
    async updateProduct(id, dataToUpdate) {
        const products = await this.readProducts();
        const productIndex = products.findIndex(p => p.id === id);

        if (productIndex === -1) {
            console.log("producto no actualizado.");
            return null;
        }

        if (dataToUpdate.id) {
            delete dataToUpdate.id;
        }
        products[productIndex] = { ...products[productIndex], ...dataToUpdate };

        await this.writeProducts(products);
        return products[productIndex];
    }

    //borrar producto
    async deleteProduct(id) {
        const products = await this.readProducts();
        
        const productIndex = products.findIndex(p => p.id === id);

        if (productIndex === -1) {
            console.log("producto no encontrado");
            return;
        }

        products.splice(productIndex, 1);

        await this.writeProducts(products);
        console.log("producto eliminado");
    }
}

module.exports = ProductManager;