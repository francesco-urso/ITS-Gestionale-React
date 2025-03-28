require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const createAdminUser = require('./seeders/adminSeeder');

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-csrf-token'],
    credentials: true,
}));

createAdminUser();

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/auth', authRoutes);

const { authMiddleware } = require('./middleware/authMiddleware');
const middlewareRoutes = require('./routes/middlewareRoutes');
app.use('/middleware', middlewareRoutes);

app.use('/', productRoutes);

app.use('/api', authMiddleware);
app.use('/api', productRoutes);

module.exports = app;


