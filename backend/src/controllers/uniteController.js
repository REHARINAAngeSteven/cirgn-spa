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
}

module.exports = UniteController;