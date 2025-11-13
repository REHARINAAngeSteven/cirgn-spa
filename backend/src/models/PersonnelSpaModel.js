// src/models/PersonnelSpaModel.js

const db = require('./db');
const PersonnelModel = require('./PersonnelModel');
// Nous aurons besoin de mettre à jour la table 'situation' après l'insertion
const SituationModel = require('./SituationModel'); 

class PersonnelSpaModel {
    /**
     * Enregistre le statut de plusieurs membres du personnel pour une situation donnée.
     * @param {number} id_spa - ID de la situation agrégée.
     * @param {Array<Object>} personnelList - Liste des objets { id_persgn, statut, id_motif, heure_spa }
     */
    static async bulkCreate(id_spa, personnelList) {
        if (!personnelList || personnelList.length === 0) {
            return 0;
        }

        let connection;
        try {
            connection = await db.getConnection();
            await connection.beginTransaction(); // Démarrer la transaction

            const insertQuery = `
                INSERT INTO personnel_spa (id_spa, id_persgn, statut, id_motif, heure_spa)
                VALUES (?, ?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE statut=VALUES(statut), id_motif=VALUES(id_motif), heure_spa=VALUES(heure_spa);
            `;
            
            const insertValues = personnelList.map(p => [
                id_spa,
                p.id_persgn,
                p.statut,
                p.statut === 'absent' || p.statut === 'indisponible' ? p.id_motif : null,
                p.heure_spa || null
            ]);
            
            // Exécuter les insertions
            for (const values of insertValues) {
                 await connection.query(insertQuery, values);
            }

            // Mettre à jour les totaux dans la table 'situation' (Logique de calcul)
            await this.updateSituationTotals(connection, id_spa);
            
            await connection.commit(); // Valider la transaction
            return personnelList.length;

        } catch (error) {
            if (connection) {
                await connection.rollback(); // Annuler en cas d'erreur
            }
            throw error;
        } finally {
            if (connection) connection.release();
        }
    }

    /**
     * Calcul et mise à jour des totaux dans la table situation.
     * Ceci est exécuté DANS la même transaction.
     */
    static async updateSituationTotals(connection, id_spa) {
        // 1. Calculer les agrégats
        const [counts] = await connection.query(`
            SELECT 
                COUNT(id_persgn) AS eff_real,
                SUM(CASE WHEN statut = 'present' THEN 1 ELSE 0 END) AS presents,
                SUM(CASE WHEN statut = 'absent' THEN 1 ELSE 0 END) AS absents,
                SUM(CASE WHEN statut = 'indisponible' THEN 1 ELSE 0 END) AS indisponibles
            FROM personnel_spa WHERE id_spa = ?;
        `, [id_spa]);

        const totals = counts[0];
        const eff_real = await PersonnelModel.countTotalPersonnel(); // Nécessite de compter le personnel total dans l'unité
        
        // 2. Mettre à jour la table situation
        await connection.query(`
            UPDATE situation
            SET eff_real = ?, presents = ?, absents = ?, indisponibles = ?, sur_le_rang = ?
            WHERE id_spa = ?;
        `, [
            eff_real, // L'effectif réel total (doit être récupéré de personnel, non pas du count de personnel_spa)
            totals.presents, 
            totals.absents, 
            totals.indisponibles, 
            eff_real - totals.absents - totals.indisponibles, // Calcul simple pour 'sur_le_rang'
            id_spa
        ]);
    }

/**
     * Enregistre un nouveau statut SPA pour un personnel.
     * @param {Object} data - { id_sit, id_persgn, id_motif, commentaire }
     * @returns {Promise<number>} ID de l'entrée créée.
     */
    static async createSPAEntry(data) {
        const query = `
            INSERT INTO personnel_spa 
            (id_sit, id_persgn, id_motif, commentaire, date_enregistrement) 
            VALUES (?, ?, ?, ?, NOW()); 
        `;
        const values = [
            data.id_sit, 
            data.id_persgn, 
            data.id_motif, 
            data.commentaire 
        ];
        const [result] = await db.query(query, values);
        return result.insertId;
    }



    // Récupère les dernières entrées SPA pour chaque membre du personnel dans une unité donnée et une situation donnée

    static async getLastSPAEntries(id_sit, id_unite) {
        const query = `
            SELECT 
                ps.id_persgn, ps.id_motif, ps.commentaire, ps.date_enregistrement,
                p.matricule, p.nom, p.prenom,
                m.libelle AS motif_libelle, m.type AS motif_type,
                u.nom_unite
            FROM personnel_spa ps
            JOIN personnel p ON ps.id_persgn = p.id_persgn
            JOIN unite u ON p.id_unite = u.id_unite
            JOIN motif m ON ps.id_motif = m.id_motif
            
            -- Filtre de l'unité de l'administrateur
            WHERE p.id_unite = ? 
            
            -- La condition critique pour ne sélectionner que l'entrée la plus récente
            AND ps.id_spa = (
                SELECT MAX(id_spa)
                FROM personnel_spa ps_max
                WHERE ps_max.id_persgn = ps.id_persgn
                AND ps_max.id_sit = ? 
            )
            
            -- On s'assure que la situation est la bonne pour la requête principale
            AND ps.id_sit = ? 
            
            ORDER BY p.matricule;
        `;
        
        // Les paramètres sont : [id_unite, id_sit, id_sit]
        const [rows] = await db.query(query, [id_unite, id_sit, id_sit]); 
        return rows;
    }



}

module.exports = PersonnelSpaModel;