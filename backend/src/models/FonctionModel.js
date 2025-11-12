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
    
    static async findByCategory(abrev_cat) {
        const query = 'SELECT * FROM fonction WHERE abrev_cat = ? ORDER BY rang;';
        const [rows] = await db.query(query, [abrev_cat]);
        return rows;
    }
    static async findByRank(rang) {
        const query = 'SELECT * FROM fonction WHERE rang = ?;';
        const [rows] = await db.query(query, [rang]);
        return rows;
    }
    static async findByLibelle(lib_fonc) {
        const query = 'SELECT * FROM fonction WHERE lib_fonc = ?;';
        const [rows] = await db.query(query, [lib_fonc]);
        return rows;
    }
    static async findById(id_fonc) {
        const query = 'SELECT * FROM fonction WHERE id_fonc = ?;';
        const [rows] = await db.query(query, [id_fonc]);
        return rows[0];
    }
    
    /**
     * Met à jour une fonction existante.
     * @param {number} id_fonc - ID de la fonction à mettre à jour.
     * @param {Object} data - Données de la fonction à mettre à jour.
     */
    static async update(id_fonc, data) {
        const query = 'UPDATE fonction SET lib_fonc = ?,abrev_cat = ?, rang = ? WHERE id_fonc = ?;';
        const values = [data.lib_fonc,data.abrev_cat ,data.rang , id_fonc];
        const [result] = await db.query(query, values);
        return result.affectedRows;
    }

    /**
     * Supprime une fonction par son ID.
     * @param {number} id_fonc - ID de la fonction à supprimer.
     */
    static async remove(id_fonc) {
        // La suppression échouera si cette fonction est référencée par la table 'personnel'.
        const query = 'DELETE FROM fonction WHERE id_fonc = ?;';
        const [result] = await db.query(query, [id_fonc]);
        return result.affectedRows;
    }
    // Ajoutez ici findById, update, delete...
}

module.exports = FonctionModel;