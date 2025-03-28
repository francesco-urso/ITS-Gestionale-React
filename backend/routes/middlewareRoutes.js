const express = require('express');
const { authMiddleware } = require('../middleware/authMiddleware');
const authMiddlewareRoutes = express.Router();

authMiddlewareRoutes.use(authMiddleware);
authMiddlewareRoutes.post('/authenticateToken', (req, res) => {
    res.json({ message: 'Token verificato con successo' });
});

module.exports = authMiddlewareRoutes;