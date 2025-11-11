// src/routes/fonctionRoutes.js

const express = require('express');
const FonctionController = require('../controllers/fonctionController');
const router = express.Router();

// Routes temporairement publiques pour le test initial
router.get('/', FonctionController.getAllFonctions);
router.post('/', FonctionController.createFonction);

module.exports = router;