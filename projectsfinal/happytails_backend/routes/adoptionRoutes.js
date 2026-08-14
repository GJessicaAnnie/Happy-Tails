const express = require('express');
const router = express.Router();
const { 
  submitApplication, 
  getMyApplications, 
  getAllApplications,
  getApplication,
  updateApplicationStatus,
  getApplicationStats
} = require('../controllers/adoptionController');
const { protect, authorize } = require('../middleware/auth');

router.get('/stats', protect, authorize('admin'), getApplicationStats);
router.get('/my-applications', protect, getMyApplications);
router.get('/applications', protect, authorize('admin'), getAllApplications);
router.get('/applications/:id', protect, getApplication);
router.post('/apply', protect, submitApplication);
router.put('/applications/:id', protect, authorize('admin'), updateApplicationStatus);

module.exports = router;
