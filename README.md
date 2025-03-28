# Progetto di Autenticazione React

## Panoramica

Questo progetto è stato sviluppato come parte del curriculum del corso React presso la Steve Jobs Academy. Implementa un'applicazione full-stack con autenticazione utente 2FA (Autenticazione a Due Fattori), gestione utenti e funzionalità di gestione prodotti.

## Tecnologie Utilizzate

### Frontend

- React 19.0.0
- Vite 6.2.0
- Material-UI (@mui/material, @mui/icons-material)
- React Router DOM 7.3.0
- Axios per richieste API
- JWT Decode per gestione token

### Backend

- Node.js con Express 4.21.2
- MySQL2 3.11.5 con Sequelize 6.37.5
- JWT (jsonwebtoken) per autenticazione
- bcrypt per hashing password
- QRCode e Speakeasy per implementazione 2FA
- Pacchetti sicurezza:
  - Helmet
  - CORS
  - Express Rate Limit

### Database

- MySQL
- Nome Database: `login_db`

## Struttura del Progetto

### Frontend

```plaintext
frontend/
├── src/
│   ├── components/
│   │   ├── admin/         # Componenti specifici admin
│   │   └── user/          # Componenti specifici utente
│   ├── pages/             # Componenti pagine principali
│   ├── App.jsx           # Componente principale applicazione
│   └── main.jsx          # Punto d'ingresso applicazione
```

### Backend

```plaintext
backend/
├── controllers/          # Gestori richieste
├── middleware/          # Middleware
├── models/             # Modelli database
├── routes/            # Route API
├── seeders/          # Creazione dati di esempio
└── server.js        # Punto d'ingresso server
```

### Struttura Database

Il database consiste in tre tabelle principali:

- **users**: Memorizza informazioni utenti e dettagli autenticazione
- **products**: Gestisce l'inventario prodotti
- **token_blacklist**: Gestisce la revoca dei token JWT

## Istruzioni di Installazione

1. Crea il database MySQL:

   ```sql
   CREATE DATABASE login_db;
   ```

2. Configurazione Backend:

   - Installa dipendenze:

     ```bash
     cd backend
     npm install
     ```

   - Configura variabili d'ambiente nel file `.env`:

     ```plaintext
        DB_HOST=localhost
        DB_USER=root
        DB_PASSWORD=xxx
        DB_NAME=login_db
        PORT=3000
        SECRET_KEY=supersecretkey
        REFRESH_SECRET=superrefreshsecretkey
        CSRF_SECRET=supercsrfsecretkey
     ```

   - Avvia il server backend:

     ```bash
     cd backend
     nodemon ./server.js
     ```

3. Configurazione Frontend:

   - Installa dipendenze:

     ```bash
     cd frontend
     npm install
     ```

   - Configura variabili d'ambiente nel file `.env`:

     ```plaintext
     VITE_API_URL=xxx
     ```

   - Avvia il frontend:

     ```bash
     cd frontend
     npm run dev
     ```

## Accesso Iniziale

Utilizza queste credenziali per il primo accesso:

- Email: `francesco@gmail.com`
- Password: `123456`

Dopo il login, puoi creare nuovi utenti che riceveranno un QR code per la configurazione 2FA. Nota: la configurazione 2FA è obbligatoria per i nuovi utenti per accedere al sistema.

## Funzionalità

- Autenticazione Utente con JWT
- Autenticazione a Due Fattori (2FA)
- Gestione Utenti (Admin)
- Gestione Prodotti
- Controllo Accessi basato su Ruoli (Admin/Utente)
- Blacklist Token
- Limitazione Richieste
- Protezione CSRF
