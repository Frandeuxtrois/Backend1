const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const productSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, index: true }, // ordenamiento
    thumbnails: { type: [String], default: [] },
    code: { type: String, required: true, unique: true, index: true }, // busqueda
    stock: { type: Number, required: true },
    status: { type: Boolean, default: true },
    category: { type: String, required: true, index: true } // filtors
});

// plugin paginación
productSchema.plugin(mongoosePaginate);

const Product = mongoose.model('Product', productSchema);

module.exports = Product;