const router = require('express').Router();
const Food = require('../models/Food');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + file.originalname)
});
const upload = multer({ storage: storage });

router.post('/', upload.single('image'), async (req, res) => {
    try {
        const newFood = new Food({
            name: req.body.name,
            price: req.body.price,
            description: req.body.description,
            image: req.file ? req.file.path : ''
        });
        const savedFood = await newFood.save();
        res.status(200).json(savedFood);
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get('/', async (req, res) => {
    try {
        const foods = await Food.find();
        res.status(200).json(foods);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;
