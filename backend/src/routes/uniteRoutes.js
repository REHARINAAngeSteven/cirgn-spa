// src/routes/uniteRoutes.js

const express = require('express');
const UniteController = require('../controllers/uniteController');
const authMiddleware = require('../middlewares/authMiddleware'); // Importation du middleware
const router = express.Router();

// Route publique
router.get('/', UniteController.getAllUnites);

// Route sécurisée (nécessite un token JWT valide)
router.post('/', authMiddleware, UniteController.createUnite);
router.put('/:id', authMiddleware, UniteController.updateUnite);
router.delete('/:id', authMiddleware, UniteController.deleteUnite);

module.exports = router;