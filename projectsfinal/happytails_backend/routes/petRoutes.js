const express = require('express');
const router = express.Router();
const { 
  getPets, 
  getPet, 
  createPet, 
  updatePet, 
  deletePet, 
  getLocations 
} = require('../controllers/petController');
const { protect, authorize } = require('../middleware/auth');

router.get('/locations', getLocations);
router.get('/', getPets);
router.get('/:id', getPet);
router.post('/', protect, authorize('admin'), createPet);
router.put('/:id', protect, authorize('admin'), updatePet);
router.delete('/:id', protect, authorize('admin'), deletePet);

module.exports = router;
