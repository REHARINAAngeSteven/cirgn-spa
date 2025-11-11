// src/models/FonctionModel.js

const db = require('./db');

class FonctionModel {
    /**
     * Récupère toutes les fonctions.
     */
    static async findAll() {
        const query = 'SELECT * FROM fonction ORDER BY lib_fonc;';
        const [rows] = await db.query(query);
        return rows;
    }
    
    /**
     * Crée une nouvelle fonction.
     */
    static async create(data) {
        const query = 'INSERT INTO fonction (lib_fonc, abrev_cat, rang) VALUES (?, ?, ?);';
        const values = [data.lib_fonc, data.abrev_cat, data.rang];
        const [result] = await db.query(query, values);
        return result.insertId;
    }
    
    // Ajoutez ici findById, update, delete...
}

module.exports = FonctionModel;