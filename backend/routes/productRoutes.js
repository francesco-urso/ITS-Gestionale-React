const express = require('express');
const productRoutes = express.Router();
const productController = require('../controllers/productController');
const { authenticateToken } = require('../middleware/authMiddleware');

productRoutes.get('/products', productController.getAllProducts);

productRoutes.post('/products', authenticateToken, productController.createProduct);
productRoutes.put('/products/:id', authenticateToken, productController.updateProduct);
productRoutes.delete('/products/:id', authenticateToken, productController.deleteProduct);

module.exports = productRoutes;