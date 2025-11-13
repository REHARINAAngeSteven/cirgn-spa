const db = require('./db');

class PersonnelModel {
/**
     * Récupère tous les enregistrements du personnel.
     * @returns {Promise<Array>} Liste de tous les personnels.
     */
    static async findAll() {
        const query = `
            SELECT 
                p.id_persgn, p.nom, p.prenom, p.matricule, p.grade, p.sexe, p.tel, p.email,
                f.lib_fonc, u.nom_unite
            FROM personnel p
            LEFT JOIN fonction f ON p.id_fonc = f.id_fonc
            LEFT JOIN unite u ON p.id_unite = u.id_unite
            ORDER BY p.nom, p.prenom;
        `;
        const [rows] = await db.query(query);
        return rows;
    }


    /**
     * Récupère un personnel par son ID.
     * @param {number} id_persgn
     * @returns {Promise<Object>} Liste de tous les personnels.
     */
    static async findById(id_persgn) {
        const query = 'SELECT * FROM personnel WHERE id_persgn = ?;';
        const [rows] = await db.query(query, [id_persgn]);
        return rows[0];
    }

 
     /** 
     * Créer un nouveau personnel.
     * @param {Object} data
     * @returns {Promise<number>} ID nampidirina
     */
    static async createPersonnel(data) {
        const query = `
        INSERT INTO personnel (nom, prenom, sexe, matricule, grade, id_fonc, id_unite, tel, email)
        VALUES (?,?,?,?,?,?,?,?,?);
        `;
        const values = [
            data.nom,data.prenom,data.sexe,data.matricule,data.grade,
            data.id_fonc,data.id_unite,data.tel,data.email
        ];
        const [result] = await db.query(query, values);
        return result.insertId;
    }


    /**
     * Compte l'effectif total (théorique) dans l'unité du personnel.
     * NOTE: Cette méthode est simplifiée. En réalité, elle devrait filtrer 
     * par l'id_unite concerné pour obtenir l'effectif de l'unité.
     */
    static async countTotalPersonnel() {
        // Idéalement, on utiliserait le 'connection' de la transaction ici.
        const query = 'SELECT COUNT(id_persgn) AS total FROM personnel;';
        const [rows] = await db.query(query);
        return rows[0].total;
    }

    /**
     * Récupère tous les enregistrements du personnel, avec options de filtrage.
     * @param {Object} filters - Ex: { matricule: 'M123', grade: 'Caporal', id_unite: 1 }
     * @returns {Promise<Array>} Liste de tous les personnels filtrés.
     */
    static async findAll(filters = {}) {
        let query = `SELECT p.*,f.lib_fonc, u.nom_unite FROM personnel p JOIN fonction f ON p.id_fonc = f.id_fonc LEFT JOIN unite u ON p.id_unite = u.id_unite`;
        
        const conditions = [];
        const values = [];

        // --- Construction dynamique des clauses WHERE ---
        if (filters.matricule) {
            conditions.push('p.matricule = ?');
            values.push(filters.matricule);
        }

        if (filters.id_unite) {
            conditions.push('p.id_unite = ?');
            values.push(filters.id_unite);
        }
        
        // recherche combinée (nom/prénom)
    //  if (filters.search) {
//         conditions.push('(p.nom LIKE ? OR p.prenom LIKE ? OR p.matricule LIKE ?)');
//         values.push(`%${filters.search}%`, `%${filters.search}%`, `%${filters.search}%`);
//      }
        
        // Ajout des conditions à la requête SQL
        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }
        
        query += ' ORDER BY p.nom, p.prenom;';
        
        const [rows] = await db.query(query, values);
        return rows;
    }

    /**
     * Met à jour les informations d'un personnel existant.
     * @param {number} id_persgn - ID du personnel à mettre à jour.
     * @param {Object} data - Données du personnel (nom, prenom, matricule, etc.).
     * @returns {Promise<number>} Nombre de lignes affectées (doit être 1).
     */
    static async update(id_persgn, data) {
        const query = `
            UPDATE personnel
            SET nom = ?, prenom = ?, sexe = ?, matricule = ?, grade = ?,
                id_fonc = ?, id_unite = ?, tel = ?, email = ?
            WHERE id_persgn = ?;
        `;
        const values = [
            data.nom, data.prenom, data.sexe, data.matricule, data.grade,
            data.id_fonc, data.id_unite, data.tel, data.email,
            id_persgn // L'ID doit être le dernier élément
        ];
        const [result] = await db.query(query, values);
        return result.affectedRows;
    }

    /**
     * Supprime un personnel par son ID.
     * @param {number} id_persgn - ID du personnel à supprimer.
     * @returns {Promise<number>} Nombre de lignes supprimées (doit être 1).
     */
    static async remove(id_persgn) {
        // NOTE: La suppression peut échouer si ce personnel est référencé 
        // par la table 'utilisateur' ou 'personnel_spa' (contrainte clé étrangère).
        const query = 'DELETE FROM personnel WHERE id_persgn = ?;';
        const [result] = await db.query(query, [id_persgn]);
        return result.affectedRows;
    }


}

module.exports = PersonnelModel;