Per il backedn installare: 

npm install 

in alternativa installare tutti i pacchetti separatamente: 

npm install bcrypt@5.1.1 bcryptjs@3.0.2 body-parser@1.20.3 cors@2.8.5 dotenv@16.4.7 express@4.21.2 express-rate-limit@7.5.0 helmet@8.1.0 jsonwebtoken@9.0.2 mysql2@3.11.5 nodemon@3.1.9 qrcode@1.5.4 rate-limit@0.1.1 sequelize@6.37.5 speakeasy@2.0.0 --legacy-peer-deps

per il frontend installare: 

npm install

in alternativa installare i pacchetti separatamente: 

npm install @eslint/js@9.21.0 @types/react@19.0.10 @types/react-dom@19.0.4 @vitejs/plugin-react@4.3.4 eslint@9.21.0 eslint-plugin-react-hooks@5.1.0 eslint-plugin-react-refresh@0.4.19 globals@15.15.0 vite@6.2.0 nodemon@3.1.9 --save-dev

Per il DB basta creare un db chiamato login_db ed il backend inserirà in automatico le tabelle,
oppure basta caricare il dumbp del DB per avere le tabelle già configurate e create con i dati aggiunti. 

Per avviare il backend:
modificare in /backedn/.env: 
    DB_HOST=localhost           # per la connessione in locale al db
    DB_USER=root                # inserire l'user di mysql
    DB_PASSWORD=xxx          # inserire la password di mysql
    
cd backend
nodemon ./server.js

Per avviare il frontend:
cd frontend
npm run dev

Per il primo accesso accedere con l'utente automaticamente creato per i test: 

email: francesco@gmail.com
Password: 123456

una volta effettuato l'accesso creare un nuovo utente al quale verrà rilasciato il codice QR
per l'autenticazione con OTP, ogni utente creato come nuovo verrà automaticamente generato il codice
secret dell'OTP che verrà salvato nel DB, se non si configura l'Authenticator sarà impossibile accedere
con gli user creati.
