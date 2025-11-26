const router = require('express').Router();
const Order = require('../models/Order');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});

const upload = multer({ storage: storage });

router.post('/', upload.single('paymentProof'), async (req, res) => {
    try {
        const items = JSON.parse(req.body.items);

        const formattedItems = items.map(item => ({
            menuId: item.menuId,
            name: item.name,
            qty: Number(item.qty),
            price: Number(item.price)
        }));

        const newOrder = new Order({
            userId: req.body.userId,
            items: formattedItems,
            totalPrice: Number(req.body.totalPrice),
            paymentProof: req.file ? req.file.filename : ''
        });

        const savedOrder = await newOrder.save();
        res.status(200).json(savedOrder);
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get('/', async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('items.menuId')
            .populate('userId', 'username email')
            .sort({ createdAt: -1 });
        res.status(200).json(orders);
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get('/:userId', async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.params.userId })
            .populate('items.menuId')
            .sort({ createdAt: -1 });
        res.status(200).json(orders);
    } catch (err) {
        res.status(500).json(err);
    }
});

router.put('/:id/status', async (req, res) => {
    try {
        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.id,
            { $set: { status: req.body.status } },
            { new: true }
        );
        res.status(200).json(updatedOrder);
    } catch (err) {
        res.status(500).json(err);
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json("Pesanan tidak ditemukan");

        if (order.status !== 'Pending') {
            return res.status(400).json("Pesanan sudah diproses, tidak bisa batal.");
        }

        await Order.findByIdAndDelete(req.params.id);
        res.status(200).json("Pesanan dibatalkan");
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;
