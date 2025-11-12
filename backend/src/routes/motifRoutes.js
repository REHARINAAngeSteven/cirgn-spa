// src/routes/motifRoutes.js

const express = require('express');
const MotifController = require('../controllers/motifController');
const authMiddleware = require('../middlewares/authMiddleware'); 
const router = express.Router();

router.get('/', MotifController.getAllMotifs);
router.post('/', authMiddleware, MotifController.createMotif);
router.put('/:id', authMiddleware, MotifController.updateMotif);
router.delete('/:id', authMiddleware, MotifController.deleteMotif);
router.get('/type/:type', MotifController.getMotifsByType);

module.exports = router;