const router = require('express').Router();
const Menu = require('../models/Menu');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});

const upload = multer({ storage: storage });

router.get('/', async (req, res) => {
    try {
        const menus = await Menu.find();
        res.status(200).json(menus);
    } catch (err) {
        res.status(500).json(err);
    }
});

router.post('/', upload.single('image'), async (req, res) => {
    const imageUrl = req.file
        ? `http://localhost:5000/uploads/${req.file.filename}`
        : 'https://placehold.co/200x200?text=No+Image';

    const newMenu = new Menu({
        name: req.body.name,
        price: Number(req.body.price),
        category: req.body.category || 'Makanan',
        kantin: req.body.kantin,
        image: imageUrl
    });

    try {
        const savedMenu = await newMenu.save();
        res.status(200).json(savedMenu);
    } catch (err) {
        res.status(500).json(err);
    }
});

router.put('/:id', upload.single('image'), async (req, res) => {
    try {
        const updateData = {
            name: req.body.name,
            price: Number(req.body.price),
            category: req.body.category,
            kantin: req.body.kantin
        };

        if (req.file) {
            updateData.image = `http://localhost:5000/uploads/${req.file.filename}`;
        }

        const updatedMenu = await Menu.findByIdAndUpdate(
            req.params.id,
            { $set: updateData },
            { new: true }
        );
        res.status(200).json(updatedMenu);
    } catch (err) {
        res.status(500).json(err);
    }
});

router.delete('/:id', async (req, res) => {
    try {
        await Menu.findByIdAndDelete(req.params.id);
        res.status(200).json("Menu deleted");
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;
