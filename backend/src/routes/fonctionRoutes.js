// src/routes/fonctionRoutes.js

const express = require('express');
const FonctionController = require('../controllers/fonctionController');
const router = express.Router();

// Routes temporairement publiques pour le test initial
router.get('/', FonctionController.getAllFonctions);
router.post('/', FonctionController.createFonction);
router.put('/:id', FonctionController.updateFonction);
router.delete('/:id', FonctionController.deleteFonction);

module.exports = router;