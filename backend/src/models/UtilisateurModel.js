// src/models/UtilisateurModel.js

const db = require('./db');

class UtilisateurModel {
    /**
     * Recherche un utilisateur par matricule.
     */
    static async findByMatricule(matricule) {
        const query = 'SELECT u.*, p.id_unite FROM utilisateur u JOIN personnel p ON u.matricule = p.matricule WHERE u.matricule = ?';
        const [rows] = await db.query(query, [matricule]);
        return rows[0];
    }
    
    /**
     * Créer un nouvel utilisateur (compte)
     */
    static async create(matricule, mdpHashed, email, role = 'militaire') {
        const query = 'INSERT INTO utilisateur (matricule, mdp, email, role) VALUES (?, ?, ?, ?)';
        const [result] = await db.query(query, [matricule, mdpHashed, email, role]);
        return result.insertId;
    }
}

module.exports = UtilisateurModel;