// src/models/UniteModel.js

const db = require('./db');

class UniteModel {
    static async findAll() {
        const query = 'SELECT * FROM unite ORDER BY nom_unite;';
        const [rows] = await db.query(query);
        return rows;
    }
    
    static async create(data) {
        const query = 'INSERT INTO unite (lib_dir, lib_sce, lib_div, nom_unite) VALUES (?, ?, ?, ?);';
        const values = [data.lib_dir, data.lib_sce, data.lib_div, data.nom_unite];
        const [result] = await db.query(query, values);
        return result.insertId;
    }


    static async update(id_unite, data) {
        // Mise à jour des champs de l'unité 
        const query = `UPDATE unite SET lib_dir = ?, lib_sce = ?, lib_div = ?, nom_unite = ?, abrev_unite = ? WHERE id_unite = ?;`;
        const values = [
            data.lib_dir, data.lib_sce, data.lib_div, 
            data.nom_unite, data.abrev_unite, 
            id_unite
        ];
        const [result] = await db.query(query, values);
        return result.affectedRows;
    }

    /**
     * Supprime une unité par son ID.
     */
    static async remove(id_unite) {
        // NOTE: La suppression échouera s'il y a des personnels ou des situations 
        // qui référencent cet id_unite (Contrainte de clé étrangère).
        const query = 'DELETE FROM unite WHERE id_unite = ?;';
        const [result] = await db.query(query, [id_unite]);
        return result.affectedRows;
    }

    // findById method to get a single unite by its ID
    static async findById(id_unite) {
        const query = 'SELECT * FROM unite WHERE id_unite = ?;';
        const [rows] = await db.query(query, [id_unite]);
        return rows[0];
    }
    // ... autres méthodes si nécessaire ... pour plus tard fa tsy izao aloha

}

module.exports = UniteModel;