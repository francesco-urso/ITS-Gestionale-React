const bcrypt = require('bcrypt');
const users = require('../models/users');

const createAdminUser = async () => {
    try {
        const existingAdmin = await users.findOne({ where: { email: 'francesco@gmail.com' } });

        if (!existingAdmin) {
            const hashedPassword = await bcrypt.hash('123456', 10);
            await users.create({
                name: 'francesco',
                email: 'francesco@gmail.com',
                password: hashedPassword,
                role: 'admin',
                created_at: new Date()
            });
            console.log('Utente Admin creato con successo');
        } else {
            console.log('L\'utente admin esiste');
        }
    } catch (error) {
        console.error('Errore durante la creazione dell\'utente admin:', error);
    }
};

module.exports = createAdminUser;