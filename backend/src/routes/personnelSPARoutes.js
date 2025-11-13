// src/routes/personnelSPARoutes.js

const express = require('express');
const PersonnelSPAController = require('../controllers/personnelSpaController');
const authMiddleware = require('../middlewares/authMiddleware'); 
const router = express.Router();

router.post('/', authMiddleware, PersonnelSPAController.createSPAEntry); // Enregistre un statut
router.get('/rapport', authMiddleware, PersonnelSPAController.getSituationReport); // Génère le rapport

module.exports = router;