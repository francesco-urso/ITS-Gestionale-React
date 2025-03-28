const app = require('./app')
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: "Troppi login effettuati, riprova tra 15 minuti",
});

app.use(helmet());
app.use("/auth/login", loginLimiter);

app.listen(process.env.PORT, () => {
    console.log(`Server in ascolto sulla posrta: ${process.env.PORT}`);
});

const sequelize = require('./db')
sequelize.sync({ alter: true })
    .then(() => console.log('Database sincronizzato'))
    .catch(err => console.error('Errore di sincronizzazione:', err));

sequelize.authenticate()
    .then(() => console.log('Connessione al DB stabilita'))
    .catch(err => console.error('Errore durante la sincronizzazione al DB:', err));