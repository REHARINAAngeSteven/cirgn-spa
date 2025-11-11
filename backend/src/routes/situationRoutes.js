// src/routes/situationRoutes.js

const express = require('express');
const SituationController = require('../controllers/situationController');
const PersonnelSpaController = require('../controllers/personnelSpaController');
const authMiddleware = require('../middlewares/authMiddleware'); 
const router = express.Router();

router.get('/', SituationController.getAllSituations);
router.post('/', authMiddleware, SituationController.createSituation);

router.get('/:id', SituationController.getSituationById);

router.post('/:id_spa/detail', authMiddleware, PersonnelSpaController.saveSituationDetail);

module.exports = router;