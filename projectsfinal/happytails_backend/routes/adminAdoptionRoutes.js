const express = require('express');
const router = express.Router();
const {
  getAdoptions,
  approveAdoption,
  rejectAdoption
} = require('../controllers/adminAdoptionController');

// Routes for admin panel
router.get('/adoptions', getAdoptions);
router.put('/adoptions/:id/approve', approveAdoption);
router.put('/adoptions/:id/reject', rejectAdoption);

module.exports = router;