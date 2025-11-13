// src/controllers/personnelSpaController.js

const PersonnelSpaModel = require('../models/PersonnelSpaModel');
const SituationModel = require('../models/SituationModel');

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
    
    /**
     * POST /api/spa : Enregistre le nouveau statut SPA d'un personnel.
     */
    static async createSPAEntry(req, res) {
        const { id_persgn, id_motif, commentaire } = req.body;
        const userId = req.user.id; // Utilisateur qui fait l'enregistrement
        const userUnitId = req.user.id_unite; // Unité de l'administrateur

        try {
            // 1. Vérifier si une situation est active
            const activeSituation = await SituationModel.findActive();
            if (!activeSituation) {
                return res.status(409).json({ message: 'Aucune situation active pour enregistrer un statut SPA.' });
            }
            const id_sit = activeSituation.id_spa;
            
            // 2. Vérification des droits d'accès
            // NOTE : Vous devez vérifier que l'id_persgn appartient bien à l'unité userUnitId, 
            // pour empêcher l'admin de modifier le statut de personnel d'autres services.
            
            // ... (logique de vérification d'appartenance à implémenter si nécessaire)

            // 3. Enregistrement de l'entrée SPA
            const newId = await PersonnelSpaModel.createSPAEntry({ 
                id_sit, 
                id_persgn, 
                id_motif, 
                commentaire 
            });

            res.status(201).json({ 
                message: 'Statut SPA enregistré avec succès.', 
                id: newId 
            });

        } catch (error) {
            console.error('Erreur lors de l\'enregistrement du statut SPA:', error);
            res.status(500).json({ message: 'Erreur serveur.' });
        }
    }

    /**
     * GET /api/spa/rapport : Génère le rapport de situation (utilise la dernière entrée).
     */
    static async getSituationReport(req, res) {
        const id_unite = req.user.id_unite; // On filtre automatiquement par l'unité de l'admin

        try {
            const activeSituation = await SituationModel.findActive();
            if (!activeSituation) {
                return res.status(404).json({ message: 'Aucune situation active pour générer le rapport.' });
            }
            const id_spa = activeSituation.id_spa;

            // Récupère la dernière entrée SPA pour chaque personnel de l'unité
            const lastSPAEntries = await PersonnelSpaModel.getLastSPAEntries(id_spa, id_unite);
            
            // Ici, vous traiterez 'lastSPAEntries' pour générer le rapport final (calcul PRESENTS, ABSENTS, etc.)
            
            res.status(200).json({ 
                situation_id: id_spa, 
                unit_report: lastSPAEntries // Le rapport non agrégé (derniers statuts individuels)
            });

        } catch (error) {
            console.error('Erreur lors de la génération du rapport SPA:', error);
            res.status(500).json({ message: 'Erreur serveur.' });
        }
        
    }   
    // Vous pouvez ajouter une fonction pour GET les détails d'une situation
}

module.exports = PersonnelSpaController;