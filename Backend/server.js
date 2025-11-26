const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/kantinkilat')
    .then(() => console.log('Database Connected'))
    .catch(err => console.log(err));

const authRoute = require('./routes/auth');
const menuRoute = require('./routes/menu');
const orderRoute = require('./routes/order');

app.use('/api/auth', authRoute);
app.use('/api/menu', menuRoute);
app.use('/api/orders', orderRoute);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
