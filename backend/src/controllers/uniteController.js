// src/controllers/uniteController.js

const UniteModel = require('../models/UniteModel');
const authMiddleware = require('../middlewares/authMiddleware'); // Pour la sécurité

class UniteController {
    
    static async getAllUnites(req, res) {
        try {
            const unites = await UniteModel.findAll();
            res.status(200).json(unites);
        } catch (error) {
            console.error('Erreur lors de la récupération des unités :', error);
            res.status(500).json({ message: 'Erreur serveur.' });
        }
    }
    
    static async createUnite(req, res) {
        try {
            const newId = await UniteModel.create(req.body);
            res.status(201).json({ message: 'Unité créée avec succès.', id: newId });
        } catch (error) {
            console.error('Erreur lors de la création de l\'unité :', error);
            res.status(500).json({ message: 'Erreur serveur.' });
        }
    }

    static async updateUnite(req, res) {
        const id_unite = req.params.id;
        try {
            const affectedRows = await UniteModel.update(id_unite, req.body);
            if (affectedRows === 0) {
                // Modifié pour inclure la possibilité d'aucune modification si les données sont identiques
                return res.status(404).json({ message: 'Unité non trouvée ou aucune modification effectuée.' });
            }
            res.status(200).json({ message: 'Unité mise à jour avec succès.', id: id_unite });
        } catch (error) {
            console.error('Erreur lors de la mise à jour de l\'unité :', error);
            res.status(500).json({ message: 'Erreur serveur lors de la mise à jour.' });
        }
    }

    static async deleteUnite(req, res) {
        const id_unite = req.params.id;
        try {
            const affectedRows = await UniteModel.remove(id_unite);
            if (affectedRows === 0) {
                return res.status(404).json({ message: 'Unité non trouvée.' });
            }
            res.status(200).json({ message: 'Unité supprimée avec succès.', id: id_unite });
        } catch (error) {
            // AJOUT: Gestion spécifique de l'erreur de clé étrangère
            if (error.code === 'ER_ROW_IS_REFERENCED_2' || error.errno === 1451) {
                return res.status(409).json({ message: 'Impossible de supprimer cette unité. Elle est référencée par du personnel ou des situations.' });
            }
            
            console.error('Erreur lors de la suppression de l\'unité :', error);
            res.status(500).json({ message: 'Erreur serveur lors de la suppression.' });
        }
    }
}

module.exports = UniteController;