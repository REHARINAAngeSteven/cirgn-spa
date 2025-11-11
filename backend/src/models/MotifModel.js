// src/models/MotifModel.js

const db = require('./db');

class MotifModel {
    /**
     * Récupère tous les motifs.
     */
    static async findAll() {
        const query = 'SELECT * FROM motif ORDER BY libelle;';
        const [rows] = await db.query(query);
        return rows;
    }
    
    /**
     * Crée un nouveau motif.
     * @param {Object} data - { libelle, type }
     */
    static async create(data) {
        // Valide que le type est l'une des valeurs ENUM ('absent', 'indisponible')
        if (!['absent', 'indisponible'].includes(data.type)) {
            throw new Error("Le type de motif doit être 'absent' ou 'indisponible'.");
        }
        
        const query = 'INSERT INTO motif (libelle, type) VALUES (?, ?);';
        const values = [data.libelle, data.type];
        const [result] = await db.query(query, values);
        return result.insertId;
    }
    
    /**
     * Récupère un motif par son ID.
     */
    static async findById(id_motif) {
        const query = 'SELECT * FROM motif WHERE id_motif = ?;';
        const [rows] = await db.query(query, [id_motif]);
        return rows[0];
    }
}

module.exports = MotifModel;