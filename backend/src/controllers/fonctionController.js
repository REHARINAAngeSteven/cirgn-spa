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
}

module.exports = FonctionController;