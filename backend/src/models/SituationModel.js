// src/models/SituationModel.js
const db = require('./db');

class SituationModel {
    /**
     * Récupère toutes les situations avec les noms d'unités.
     */
    static async findAll() {
        const query = `
            SELECT s.*, u.nom_unite
            FROM situation s
            JOIN unite u ON s.id_unite = u.id_unite
            ORDER BY s.date_spa DESC;
        `;
        const [rows] = await db.query(query);
        return rows;
    }
    
    /**
     * Crée une nouvelle situation.
     * REMARQUE : Dans l'application réelle, les totaux (eff_real, absents, etc.) 
     * seront calculés après l'insertion des détails dans personnel_spa.
     * Pour l'instant, on insère les champs obligatoires (date_spa, id_unite) 
     * et les totaux peuvent être à 0 ou fournis.
     * * @param {Object} data - { date_spa, id_unite, ... }
     */
    static async create(data) {
        const query = `
            INSERT INTO situation (date_spa, id_unite, eff_real, absents, presents, indisponibles, sur_le_rang)
            VALUES (?, ?, ?, ?, ?, ?, ?);
        `;
        const values = [
            data.date_spa,
            data.id_unite,
            data.eff_real || 0, // Valeurs par défaut à 0 pour le début
            data.absents || 0,
            data.presents || 0,
            data.indisponibles || 0,
            data.sur_le_rang || 0
        ];
        const [result] = await db.query(query, values);
        return result.insertId;
    }
    
    /**
     * Récupère une situation par son ID.
     */
    static async findById(id_spa) {
        const query = 'SELECT * FROM situation WHERE id_spa = ?;';
        const [rows] = await db.query(query, [id_spa]);
        return rows[0];
    }
    
    // NOTE: La méthode update sera cruciale pour mettre à jour les totaux !
}

module.exports = SituationModel;