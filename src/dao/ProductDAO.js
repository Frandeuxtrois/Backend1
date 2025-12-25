const Product = require('../models/product.model.js');

class ProductDAO {
    async getProducts({ limit = 10, page = 1, sort, query }) {
        const options = {
            page,
            limit,
            lean: true,
            select: '-__v'
        };
        if (sort) {
            options.sort = { price: sort === 'asc' ? 1 : -1 };
        }

        const filter = {};
        if (query) {
            filter.$or = [
                { category: query },
                { status: query === 'true' ? true : (query === 'false' ? false : undefined) }
            ];
        }

        return await Product.paginate(filter, options);
    }

    async addProduct(productData) {
        return await Product.create(productData);
    }

    async getProductById(id) {
        return await Product.findById(id).select('-__v').lean();
    }

    async updateProduct(id, fieldsToUpdate) {
        return await Product.findByIdAndUpdate(id, fieldsToUpdate, { new: true }).lean();
    }

    async deleteProduct(id) {
        return await Product.findByIdAndDelete(id);
    }
}

module.exports = ProductDAO;