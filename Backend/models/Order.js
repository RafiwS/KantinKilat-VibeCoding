const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [
        {
            menuId: { type: mongoose.Schema.Types.ObjectId, ref: 'Menu' },
            name: String,
            qty: Number,
            price: Number
        }
    ],
    totalPrice: { type: Number, required: true },
    paymentProof: { type: String, required: true },
    status: { type: String, enum: ['Pending', 'Diproses', 'Siap Diambil', 'Selesai'], default: 'Pending' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', OrderSchema);
