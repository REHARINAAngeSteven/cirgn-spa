// src/controllers/authController.js (VERSION CORRIGÉE)

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UtilisateurModel = require('../models/UtilisateurModel');
const PersonnelModel = require('../models/PersonnelModel'); // Assurez-vous d'importer le modèle personnel

class AuthController {
    
    static async register(req, res) {
        const { nom, prenom, sexe, matricule, grade, id_fonc, id_unite, tel, email, mdp } = req.body;

        try {
            // 1. Verification ny compte s'il existe déjà 
            const existingUser = await UtilisateurModel.findByMatricule(matricule);
            if (existingUser) {
                return res.status(409).json({ message: 'Un compte existe déjà pour ce matricule.' });
            }

            // 2. Hacher le mot de passe
            const salt = await bcrypt.genSalt(10);
            const mdpHashed = await bcrypt.hash(mdp, salt);

            // 3. Créer la fiche Personnel
            const personnelData = { nom, prenom, sexe, matricule, grade, id_fonc, id_unite, tel, email };
            
            // CORRECTION: Utilisez 'create' pour correspondre à PersonnelModel.js
            const id_persgn = await PersonnelModel.createPersonnel(personnelData); 
            
            if (!id_persgn) {
                return res.status(500).json({ message: 'Erreur lors de la création de la fiche personnel.' });
            }
            
            // 4. Créer le compte Utilisateur
            // NOTE: Assurez-vous que votre UtilisateurModel.create accepte le rôle comme 4ème paramètre
            const id_user = await UtilisateurModel.create(matricule, mdpHashed, email, 'militaire', id_persgn); 

            res.status(201).json({ 
                message: 'Inscription réussie.',
                userId: id_user,
                personnelId: id_persgn 
            });

        } catch (error) {
            console.error('Erreur lors de l\'inscription :', error);
            if (error.code === 'ER_NO_REFERENCED_ROW_2') {
                return res.status(400).json({ message: 'L\'unité ou la fonction spécifiée est invalide.' });
            }
            res.status(500).json({ message: 'Erreur serveur.' });
        }
    }

    static async login(req, res) {
        const { matricule, mdp } = req.body;

        try {
            const user = await UtilisateurModel.findByMatricule(matricule);

            if (!user) {
                return res.status(404).json({ message: 'Matricule ou mot de passe incorrect.' });
            }

            // Vérification (bcrypt.compare)
            const isMatch = await bcrypt.compare(mdp, user.mdp);

            if (!isMatch) {
                return res.status(401).json({ message: 'Matricule ou mot de passe incorrect.' });
            }

            // Création du token JWT
            const token = jwt.sign(
                { id: user.id_user, role: user.role, matricule: user.matricule },
                process.env.JWT_SECRET, // CORRECTION : Utilisez seulement la variable d'environnement
                { expiresIn: '24h' } // MODIFIÉ : Token valide 24 heures
            );

            res.status(200).json({ 
                message: 'Connexion réussie', 
                token, 
                user: { matricule: user.matricule, role: user.role } 
            });

        } catch (error) {
            console.error('Erreur lors de la connexion :', error);
            res.status(500).json({ message: 'Erreur serveur lors de l\'authentification.' });
        }
    }
}

module.exports = AuthController;