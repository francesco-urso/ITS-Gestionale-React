const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const users = require('../models/users');
const token_blacklist = require('../models/token_blacklist');
const { generateToken } = require('../middleware/authMiddleware');
const speakeasy = require("speakeasy");
const QRCode = require("qrcode");

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await users.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: 'Utente non trovato!' });
        }

        if (user.isDeleted === true || user.isDeleted === 1) {
            return res.status(403).json({
                message: 'Account disabilitato',
                isDisabled: true
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Password errata!' });
        }

        if (user.otp_secret) {
            const tempToken = jwt.sign(
                { userId: user.id, temp: true },
                process.env.SECRET_KEY,
                { expiresIn: '5m' }
            );

            return res.json({
                requires2FA: true,
                userId: user.id,
                tempToken,
                message: 'Verifica 2FA richiesta'
            });
        }

        const { token, jti } = generateToken(user);
        res.json({
            message: 'Login effettuato!',
            token,
            jti,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Errore durante il login' });
    }
};

exports.register = async (req, res) => {
    const { name, email, password, role } = req.body;

    if (!name || !password || !email) {
        return res.status(400).json({ message: 'Tutti i campi sono obbligatori!' });
    }

    try {
        const existingUser = await users.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'Email già registrata!' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const secret = speakeasy.generateSecret({
            name: `MyApp:${email}`,
            length: 20
        });

        const qrCode = await QRCode.toDataURL(secret.otpauth_url);

        const newUser = await users.create({
            name,
            email,
            password: hashedPassword,
            role: role || 'user',
            otp_secret: secret.base32,
            created_at: new Date()
        });

        res.status(201).json({
            message: 'Utente registrato!',
            user: newUser,
            qrCode,
            secret: secret.base32
        });

    } catch (err) {
        console.error('Errore nel server:', err);
        res.status(500).json({ message: 'Errore durante la registrazione' });
    }
};

exports.logout = (req, res) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(400).send({ error: 'Token non trovato' });
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const jti = decoded.jti;

        token_blacklist.create({ token_id: jti })
            .then(() => {
                res.status(200).send({ message: 'Logout effettuato con successo' });
            })
            .catch((err) => {
                console.error('Errore nell\'inserimento del token nella blacklist:', err);
                res.status(500).send({ error: 'Logout fallito' });
            });

    } catch (error) {
        res.status(401).send({ error: 'Token non valido o scaduto' });
    }
};

exports.getUsers = async (req, res) => {
    try {
        const allUsers = await users.findAll();
        res.status(200).json(allUsers);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Errore ricerca user' });
    }
};

exports.updateUser = async (req, res) => {
    const { id } = req.params;
    const { name, email, password, role } = req.body;

    try {
        const user = await users.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: 'Utente non trovato!' });
        }

        const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;

        await user.update({
            name: name || user.name,
            email: email || user.email,
            password: hashedPassword || user.password,
            role: role || user.role,
            updated_at: new Date()
        });

        res.status(200).json({ message: 'Utente aggiornato!', user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Errore durante l\'aggiornamento' });
    }
};

exports.deactiveUser = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await users.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: 'Utente non trovato!' });
        }

        await user.update({
            isDeleted: 1,
            updated_at: new Date()
        });

        res.status(200).json({ message: 'Utente disattivato!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Errore durante la disattivazione dell\'user' });
    }
};

exports.reactivateUser = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await users.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: 'Utente non trovato!' });
        }

        await user.update({
            isDeleted: 0,
            updated_at: new Date()
        });

        res.status(200).json({ message: 'Utente riattivato!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Errore durante la riattivazione dell\'user' });
    }
};

exports.deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await users.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: 'Utente non trovato!' });
        }

        await user.destroy();

        res.status(200).json({ message: 'Utente eliminato!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Errore durante eliminazione utente' });
    }
};

exports.enable2FA = async (req, res) => {
    const { userId } = req.body;

    try {
        const user = await users.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: 'Utente non trovato!' });
        }

        const secret = speakeasy.generateSecret({
            name: `MyApp:${user.email}`,
            length: 20
        });

        await user.update({
            otp_secret: secret.base32
        });

        const qrCode = await QRCode.toDataURL(secret.otpauth_url);
        res.json({
            success: true,
            qrCode,
            secret: secret.base32
        });
    } catch (error) {
        console.error('2FA Errore:', error);
        res.status(500).json({ message: "Errore durante l'attivazione 2FA" });
    }
};

exports.verify2FA = async (req, res) => {
    const { userId, token } = req.body;

    try {
        console.log('Ricevuta richiesta 2FA:', { userId, token });

        const user = await users.findByPk(userId);
        if (!user || !user.otp_secret) {
            return res.status(404).json({ message: 'Utente non trovato o 2FA non configurato' });
        }

        const cleanToken = typeof token === 'string' ? token : token.toString();

        const verified = speakeasy.totp.verify({
            secret: user.otp_secret,
            encoding: 'base32',
            token: cleanToken,
            window: 2,
            step: 30
        });

        if (verified) {
            const { token: jwtToken, jti } = generateToken(user);
            res.json({
                success: true,
                message: 'Login effettuato!',
                token: jwtToken,
                jti,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            });
        } else {
            res.status(400).json({
                message: 'Codice OTP non valido'
            });
        }
    } catch (error) {
        console.error('2FA Errore durante la verifica:', error);
        res.status(500).json({ message: 'Errore durante la verifica 2FA' });
    }
};
