const mongoose = require('mongoose');

const MenuSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, default: 'Makanan' },
    kantin: { type: String, default: 'Kantin Pusat' }, 
    image: { type: String, default: '' }
});

module.exports = mongoose.model('Menu', MenuSchema);
