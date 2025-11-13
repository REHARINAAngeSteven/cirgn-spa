const PersonnelModel = require ('../models/PersonnelModel');

class PersonnelController {
    
    /**
     * GET /api/personnel : Liste tout le personnel avec filtres (req.query).
     */
    static async getAllPersonnel(req, res) {
        // Récupération des filtres depuis l'URL (req.query)
        const filters = req.query; 
        const role = req.user.role; // Récupération du rôle de l'utilisateur connecté
        const adminUnitID = req.user.id_unite; // Récupération de l'unité de l'admin connecté
        if (role === 'admin' && adminUnitID) {
            // Si l'utilisateur est admin, on ajoute un filtre sur son unité
            filters.id_unite = adminUnitID;
        }
        
        try {
            // CORRECTION 1 : Appeler la méthode findAll() et lui passer les filtres
            const personnel = await PersonnelModel.findAll(filters); 
            res.status(200).json(personnel);
        } catch (error) {
            console.error('Erreur lors de la récupération du personnel:', error);
            res.status(500).json({
                message: 'Erreur serveur lors de la récupération du personnel.',
                error: error.message
            });
        }
    }

    /**
     * POST /api/personnel : Crée un nouveau personnel.
     */
    static async createPersonnel(req, res) {
        try {
            // CORRECTION 2 : Passer seulement les données (req.body) au modèle
            const newID = await PersonnelModel.create(req.body); 
            res.status(201).json({
                message: 'Personnel crée avec succès.',
                id: newID
            });
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({message: 'Le matricule existe déjà.'});   
            }
            console.error('Erreur lors de la création du personnel:', error);
            res.status(500).json({
                message: 'Erreur serveur lors de la création du personnel.',
                error: error.message
            });
        }
    }
/**
     * PUT /api/personnel/:id : Met à jour un personnel.
     */
    static async updatePersonnel(req, res) {
        const id_persgn = req.params.id; // Récupère l'ID depuis l'URL
        try {
            const affectedRows = await PersonnelModel.update(id_persgn, req.body);
            
            if (affectedRows === 0) {
                return res.status(404).json({ message: 'Personnel non trouvé ou aucune modification effectuée.' });
            }
            
            res.status(200).json({
                message: 'Personnel mis à jour avec succès.',
                id: id_persgn
            });
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({ message: 'Le matricule existe déjà.' });
            }
            console.error('Erreur lors de la mise à jour du personnel:', error);
            res.status(500).json({ message: 'Erreur serveur lors de la mise à jour.', error: error.message });
        }
    }

    /**
     * DELETE /api/personnel/:id : Supprime un personnel.
     */
    static async deletePersonnel(req, res) {
        const id_persgn = req.params.id;
        try {
            const affectedRows = await PersonnelModel.remove(id_persgn);
            
            if (affectedRows === 0) {
                return res.status(404).json({ message: 'Personnel non trouvé.' });
            }
            
            res.status(200).json({
                message: 'Personnel supprimé avec succès.',
                id: id_persgn
            });
        } catch (error) {
             // ER_ROW_IS_REFERENCED est l'erreur typique de clé étrangère
            if (error.code === 'ER_ROW_IS_REFERENCED_2' || error.errno === 1451) {
                return res.status(409).json({ message: 'Impossible de supprimer ce personnel. Il est référencé par un compte utilisateur ou une situation SPA.' });
            }
            console.error('Erreur lors de la suppression du personnel:', error);
            res.status(500).json({ message: 'Erreur serveur lors de la suppression.', error: error.message });
        }
    }
    /**
     * PUT /api/personnel/:id : Met à jour un personnel.
     */
    static async updatePersonnel(req, res) {
        const id_persgn = req.params.id; // Récupère l'ID depuis l'URL
        try {
            const affectedRows = await PersonnelModel.update(id_persgn, req.body);
            
            if (affectedRows === 0) {
                return res.status(404).json({ message: 'Personnel non trouvé ou aucune modification effectuée.' });
            }
            
            res.status(200).json({
                message: 'Personnel mis à jour avec succès.',
                id: id_persgn
            });
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({ message: 'Le matricule existe déjà.' });
            }
            console.error('Erreur lors de la mise à jour du personnel:', error);
            res.status(500).json({ message: 'Erreur serveur lors de la mise à jour.', error: error.message });
        }
    }

    /**
     * DELETE /api/personnel/:id : Supprime un personnel.
     */
    static async deletePersonnel(req, res) {
        const id_persgn = req.params.id;
        try {
            const affectedRows = await PersonnelModel.remove(id_persgn);
            
            if (affectedRows === 0) {
                return res.status(404).json({ message: 'Personnel non trouvé.' });
            }
            
            res.status(200).json({
                message: 'Personnel supprimé avec succès.',
                id: id_persgn
            });
        } catch (error) {
             // ER_ROW_IS_REFERENCED est l'erreur typique de clé étrangère
            if (error.code === 'ER_ROW_IS_REFERENCED_2' || error.errno === 1451) {
                return res.status(409).json({ message: 'Impossible de supprimer ce personnel. Il est référencé par un compte utilisateur ou une situation SPA.' });
            }
            console.error('Erreur lors de la suppression du personnel:', error);
            res.status(500).json({ message: 'Erreur serveur lors de la suppression.', error: error.message });
        }
    }
}

module.exports = PersonnelController;