// src/models/db.js

const mysql = require('mysql2/promise'); // Utilisation de la version 'promise' pour async/await
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    // --- AJOUT DES OPTIONS CRITIQUES ---
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    // Le jeu de caractères le plus compatible (résout les problèmes de jointure silencieuse)
    charset: 'utf8mb4',
    // Permet de lire les dates/heures correctement
    dateStrings: true 
    // ------------------------------------
});

module.exports = pool;