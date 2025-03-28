const express = require('express');
const authRoutes = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken, isAdmin } = require('../middleware/authMiddleware');
const csrfProtection = require('../middleware/csrfMiddleware');

authRoutes.post('/login', csrfProtection, authController.login);
authRoutes.post('/logout', csrfProtection, authController.logout);
authRoutes.post('/verify-2fa', csrfProtection, authController.verify2FA);
authRoutes.post('/enable-2fa', csrfProtection, authController.enable2FA);

authRoutes.post("/refresh", csrfProtection, (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(403).json({ message: "Token mancante" });

    jwt.verify(refreshToken, process.env.REFRESH_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ message: "Token non valido" });
        const newAccessToken = jwt.sign(
            { id: decoded.id },
            process.env.JWT_SECRET,
            { expiresIn: "15m" }
        );
        res.json({ token: newAccessToken });
    });
});

authRoutes.post('/register', authenticateToken, isAdmin, authController.register);
authRoutes.get('/users', authenticateToken, isAdmin, authController.getUsers);
authRoutes.put('/users/:id', authenticateToken, isAdmin, authController.updateUser);
authRoutes.delete('/users/:id', authenticateToken, isAdmin, authController.deactiveUser);
authRoutes.put('/users/:id/reactivate', authenticateToken, authController.reactivateUser);
authRoutes.delete('/users/:id/delete', authenticateToken, authController.deleteUser);

module.exports = authRoutes;
