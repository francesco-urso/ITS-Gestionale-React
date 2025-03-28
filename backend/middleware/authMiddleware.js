const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const db = require('../db');
const token_blacklist = require('../models/token_blacklist');
require('dotenv').config();

const authenticateToken = (req, res, next) => {
    console.log('Middle attivato')
    const authHeader = req.headers['authorization'];
    //console.log('Header ricevuto:', req.headers);
    const token = authHeader && authHeader.split(' ')[1];

    //console.log('Token ricevuto nel middleware:', token);

    if (!token) {
        return res.status(401).json({ message: 'Accesso negato. Token mancante!' });
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        console.log('Decoded JTI:', decoded);

        token_blacklist.findOne({
            where: { token_id: decoded.jti }
        }).then((blacklistedToken) => {
            //console.log('Query blacklist:', blacklistedToken);
            if (blacklistedToken) {
                console.log('Token trovato nella blacklist:', decoded.jti);
                return res.status(401).json({ error: 'Token invalidato.' });
            }

            req.user = decoded;
            next();
        }).catch((err) => {
            console.error('Errore nel database:', err);
            return res.status(500).json({ error: 'Errore nel database.' });
        });
    } catch (error) {
        console.error('Errore durante la verifica del token:', error);
        res.status(403).json({ message: 'Token non valido!' });
    }
};

const generateToken = (user) => {
    const jti = uuidv4();
    const token = jwt.sign(
        {
            id: user.id,
            username: user.username,
            role: user.role,
            jti,
        },
        process.env.SECRET_KEY,
        { expiresIn: '1h' }
    );
    return { token, jti };
};

const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).send({ error: 'Accesso negato, token mancante!' });
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        //console.log('Decoded JTI:', decoded.jti);
        token_blacklist.findOne({ where: { token_id: decoded.jti } })
            .then((blacklistedToken) => {
                if (blacklistedToken) {
                    console.log('Token trovato nella blacklist:', decoded.jti);
                    return res.status(401).send({ error: 'Token invalidato con successo' });
                }

                req.user = decoded;
                next();
            })
            .catch((err) => {
                console.error('Errore nel database:', err);
                return res.status(500).send({ error: 'Errore nel database' });
            });

    } catch (error) {
        console.error('Errore durante la verifica del token:', error);
        res.status(401).send({ error: 'Token non valido o scaduto' });
    }
};

const isAdmin = async (req, res, next) => {
    try {
        if (req.user && req.user.role === 'admin') {
            next();
        } else {
            res.status(403).json({ message: 'Accesso negato' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Errore durante la verifica dei permessi.' });
    }
};

module.exports = { authenticateToken, generateToken, authMiddleware, isAdmin };
