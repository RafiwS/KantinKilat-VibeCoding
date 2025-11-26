const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage: storage });

router.post('/register', async (req, res) => {
    try {
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) return res.status(400).json("Email sudah terdaftar");

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        const isStudent = req.body.role === 'mahasiswa';

        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
            role: req.body.role || 'mahasiswa',
            isVerified: isStudent ? true : false
        });

        const user = await newUser.save();
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json(err);
    }
});

router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) return res.status(404).json("User not found");

        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) return res.status(400).json("Invalid password");

        if (user.role === 'penjual' && !user.isVerified) {
            return res.status(403).json("Akun sedang diverifikasi oleh Pihak ITS. Mohon tunggu.");
        }

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);

        const { password, ...userData } = user._doc;

        res.status(200).json({ ...userData, token });
    } catch (err) {
        res.status(500).json(err);
    }
});

router.put('/update-profile', upload.single('qrisImage'), async (req, res) => {
    try {
        const updateData = {
            kantinName: req.body.kantinName,
            kantinLocation: req.body.kantinLocation
        };

        if (req.file) {
            updateData.qrisImage = `http://localhost:5000/uploads/${req.file.filename}`;
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.body.userId,
            { $set: updateData },
            { new: true }
        );

        const { password, ...userData } = updatedUser._doc;
        res.status(200).json(userData);
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get('/pending-sellers', async (req, res) => {
    try {
        const pendingSellers = await User.find({ role: 'penjual', isVerified: false });
        res.status(200).json(pendingSellers);
    } catch (err) {
        res.status(500).json(err);
    }
});

router.put('/verify-user/:id', async (req, res) => {
    try {
        await User.findByIdAndUpdate(req.params.id, { $set: { isVerified: true } });
        res.status(200).json("User berhasil diverifikasi");
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get('/kantin/:name', async (req, res) => {
    try {
        const seller = await User.findOne({ kantinName: req.params.name });
        if (!seller) return res.status(404).json("Kantin tidak ditemukan");

        res.status(200).json({
            kantinName: seller.kantinName,
            kantinLocation: seller.kantinLocation,
            qrisImage: seller.qrisImage || ""
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;
