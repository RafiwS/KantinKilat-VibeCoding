const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'mahasiswa' },
    kantinName: { type: String, default: '' },
    kantinLocation: { type: String, default: 'Kantin Pusat' },
    qrisImage: { type: String, default: '' },
    isVerified: { type: Boolean, default: false }
});

module.exports = mongoose.model('User', UserSchema);
