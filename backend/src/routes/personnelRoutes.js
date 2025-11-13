const express = require('express');
const PersonnelController = require('../controllers/personnelController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

// route zalahyyy ee 
router.get ('/',authMiddleware, PersonnelController.getAllPersonnel);
router.post('/',authMiddleware, PersonnelController.createPersonnel);
router.put('/:id',authMiddleware, PersonnelController.updatePersonnel);
router.delete('/:id',authMiddleware, PersonnelController.deletePersonnel);


module.exports = router;