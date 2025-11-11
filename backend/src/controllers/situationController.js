// src/controllers/situationController.js

const SituationModel = require('../models/SituationModel');

class SituationController {
    
    /**
     * GET /api/situation : Liste toutes les situations.
     */
    static async getAllSituations(req, res) {
        try {
            const situations = await SituationModel.findAll();
            res.status(200).json(situations);
        } catch (error) {
            console.error('Erreur lors de la récupération des situations :', error);
            res.status(500).json({ message: 'Erreur serveur.' });
        }
    }
    
    /**
     * POST /api/situation : Crée un nouvel enregistrement de situation.
     */
    static async createSituation(req, res) {
        // Validation minimale
        if (!req.body.date_spa || !req.body.id_unite) {
            return res.status(400).json({ message: 'date_spa et id_unite sont requis.' });
        }
        
        try {
            const newId = await SituationModel.create(req.body);
            res.status(201).json({ message: 'Situation créée avec succès.', id: newId });
        } catch (error) {
            console.error('Erreur lors de la création de la situation :', error);
            res.status(500).json({ message: 'Erreur serveur.' });
        }
    }
    
    /**
     * GET /api/situation/:id : Récupère une situation spécifique.
     */
    static async getSituationById(req, res) {
        try {
            const situation = await SituationModel.findById(req.params.id);
            if (!situation) {
                return res.status(404).json({ message: 'Situation non trouvée.' });
            }
            res.status(200).json(situation);
        } catch (error) {
            console.error('Erreur lors de la récupération de la situation :', error);
            res.status(500).json({ message: 'Erreur serveur.' });
        }
    }
}

module.exports = SituationController;