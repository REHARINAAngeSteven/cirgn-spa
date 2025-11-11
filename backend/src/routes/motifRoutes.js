// src/routes/motifRoutes.js

const express = require('express');
const MotifController = require('../controllers/motifController');
const authMiddleware = require('../middlewares/authMiddleware'); 
const router = express.Router();

// GET /api/motif : Publique (pour récupérer la liste des références)
router.get('/', MotifController.getAllMotifs);

// POST /api/motif : Sécurisée (création réservée aux utilisateurs logués)
router.post('/', authMiddleware, MotifController.createMotif);

module.exports = router;