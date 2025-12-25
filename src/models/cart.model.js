const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    products: {
        type: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Product'
                },
                quantity: {
                    type: Number,
                    required: true
                }
            }
        ],
        default: []
    }
});

// middleware para ejecutar populate automaticamente en findone
cartSchema.pre('findOne', function() {
    this.populate('products.product');
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;