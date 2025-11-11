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
}

module.exports = MotifController;