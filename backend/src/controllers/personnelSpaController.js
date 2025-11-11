// src/controllers/personnelSpaController.js

const PersonnelSpaModel = require('../models/PersonnelSpaModel');

class PersonnelSpaController {
    
    /**
     * POST /api/situation/:id_spa/detail : Enregistre le détail de la situation.
     */
    static async saveSituationDetail(req, res) {
        const id_spa = parseInt(req.params.id_spa);
        const { personnelList } = req.body; // personnelList est un tableau

        if (!id_spa || !personnelList || personnelList.length === 0) {
            return res.status(400).json({ message: 'L\'ID de la situation et la liste du personnel sont requis.' });
        }
        
        try {
            const count = await PersonnelSpaModel.bulkCreate(id_spa, personnelList);
            res.status(200).json({ 
                message: 'Détails de la situation enregistrés et totaux mis à jour.',
                recordsUpdated: count
            });
        } catch (error) {
            console.error('Erreur lors de l\'enregistrement des détails de la situation :', error);
            res.status(500).json({ message: 'Erreur serveur lors de la mise à jour des détails.', error: error.message });
        }
    }
    
    // Vous pouvez ajouter une fonction pour GET les détails d'une situation
}

module.exports = PersonnelSpaController;