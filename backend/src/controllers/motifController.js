// src/controllers/motifController.js

const MotifModel = require('../models/MotifModel');

class MotifController {
    
    /**
     * GET /api/motif : Liste tous les motifs.
     */
    static async getAllMotifs(req, res) {
        try {
            const motifs = await MotifModel.findAll();
            res.status(200).json(motifs);
        } catch (error) {
            console.error('Erreur lors de la récupération des motifs :', error);
            res.status(500).json({ message: 'Erreur serveur.' });
        }
    }
    
    /**
     * POST /api/motif : Crée un nouveau motif.
     */
    static async createMotif(req, res) {
        try {
            const newId = await MotifModel.create(req.body);
            res.status(201).json({ message: 'Motif créé avec succès.', id: newId });
        } catch (error) {
            console.error('Erreur lors de la création du motif :', error.message);
            // Si l'erreur vient de la validation du type (dans le modèle)
            if (error.message.includes('Le type de motif')) {
                 return res.status(400).json({ message: error.message });
            }
            res.status(500).json({ message: 'Erreur serveur.' });
        }
    }
    /**
     * PUT /api/motif/:id : Met à jour un motif existant.
     */
    static async updateMotif(req, res) {
        const id_motif = req.params.id;
        try {
            const affectedRows = await MotifModel.update(id_motif, req.body);
            if (affectedRows === 0) {
                return res.status(404).json({ message: 'Motif non trouvé ou aucune modification effectuée.' });
            }
            res.status(200).json({ message: 'Motif mis à jour avec succès.', id: id_motif });
        } catch (error) {
            console.error('Erreur lors de la mise à jour du motif :', error);
            res.status(500).json({ message: 'Erreur serveur pendant la mise à jour.' });
        }
    }

    /**
     * DELETE /api/motif/:id : Supprime un motif par son ID.
     */
    static async deleteMotif(req, res) {
        const id_motif = req.params.id;
        try {
            const affectedRows = await MotifModel.remove(id_motif);
            if (affectedRows === 0) {
                return res.status(404).json({ message: 'Motif non trouvé.' });
            }
            res.status(200).json({ message: 'Motif supprimé avec succès.', id: id_motif });
        } catch (error) {
            // Log de l'erreur pour des clés etrangères ou autres problèmes
            if (error.code === 'ER_ROW_IS_REFERENCED_2' || error.errno === 1451) {
                return res.status(409).json({ message: 'Impossible de supprimer ce motif. Il est référencé dans des situations actives.' });
            }
            console.error('Erreur lors de la suppression du motif :', error);
            res.status(500).json({ message: 'Erreur serveur pendant la suppression.' });
        }
    }

    static async getMotifsByType(req, res) {
        const type = req.params.type;
        try {
            const motifs = await MotifModel.findByType(type);
            res.status(200).json(motifs);
        } catch (error) {
            console.error('Erreur lors de la récupération des motifs par type :', error.message);
            if (error.message.includes('Le type de motif')) {
                return res.status(400).json({ message: error.message });
            }
            console.error(`Erreur lors de la récupération des motifs de type ${type}:`, error);
            res.status(500).json({ message: 'Erreur serveur.' });
        }
    }
}

module.exports = MotifController;