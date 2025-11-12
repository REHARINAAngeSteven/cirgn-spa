// src/controllers/fonctionController.js

const FonctionModel = require('../models/FonctionModel');

class FonctionController {
    
    static async getAllFonctions(req, res) {
        try {
            const fonctions = await FonctionModel.findAll();
            res.status(200).json(fonctions);
        } catch (error) {
            console.error('Erreur lors de la récupération des fonctions :', error);
            res.status(500).json({ message: 'Erreur serveur.' });
        }
    }
    
    static async createFonction(req, res) {
        try {
            const newId = await FonctionModel.create(req.body);
            res.status(201).json({ message: 'Fonction créée avec succès.', id: newId });
        } catch (error) {
            console.error('Erreur lors de la création de la fonction :', error);
            res.status(500).json({ message: 'Erreur serveur.' });
        }
    }
    
    
    /**
     * PUT /api/fonction/:id : Met à jour une fonction.
     */
    static async updateFonction(req, res) {
        const id_fonc = req.params.id;
        try {
            const affectedRows = await FonctionModel.update(id_fonc, req.body);
            
            if (affectedRows === 0) {
                return res.status(404).json({ message: 'Fonction non trouvée ou aucune modification effectuée.' });
            }
            
            res.status(200).json({ message: 'Fonction mise à jour avec succès.', id: id_fonc });
        } catch (error) {
            console.error('Erreur lors de la mise à jour de la fonction:', error);
            res.status(500).json({ message: 'Erreur serveur lors de la mise à jour.' });
        }
    }

    /**
     * DELETE /api/fonction/:id : Supprime une fonction.
     */
    static async deleteFonction(req, res) {
        const id_fonc = req.params.id;
        try {
            const affectedRows = await FonctionModel.remove(id_fonc);
            
            if (affectedRows === 0) {
                return res.status(404).json({ message: 'Fonction non trouvée.' });
            }
            
            res.status(200).json({ message: 'Fonction supprimée avec succès.', id: id_fonc });
        } catch (error) {
            // Gestion de l'erreur de clé étrangère
            if (error.code === 'ER_ROW_IS_REFERENCED_2' || error.errno === 1451) {
                return res.status(409).json({ message: 'Impossible de supprimer cette fonction. Elle est référencée par du personnel.' });
            }
            console.error('Erreur lors de la suppression de la fonction:', error);
            res.status(500).json({ message: 'Erreur serveur lors de la suppression.' });
        }
    }
    static async getFonctionById(req, res) {
        const id_fonc = req.params.id;
        try {
            const fonction = await FonctionModel.findById(id_fonc);
            if (!fonction) {
                return res.status(404).json({ message: 'Fonction non trouvée.' });
            }
            res.status(200).json(fonction);
        } catch (error) {
            console.error('Erreur lors de la récupération de la fonction :', error);
            res.status(500).json({ message: 'Erreur serveur.' });
        }
    }
}

module.exports = FonctionController;