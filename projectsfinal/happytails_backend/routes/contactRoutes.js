const express = require('express');
const router = express.Router();
const { 
  submitMessage, 
  getAllMessages, 
  getMessage,
  updateMessageStatus,
  deleteMessage,
  getMessageStats
} = require('../controllers/contactController');
const { protect, authorize } = require('../middleware/auth');

router.get('/stats', protect, authorize('admin'), getMessageStats);
router.get('/', protect, authorize('admin'), getAllMessages);
router.get('/:id', protect, authorize('admin'), getMessage);
router.post('/', submitMessage);
router.put('/:id/status', protect, authorize('admin'), updateMessageStatus);
router.delete('/:id', protect, authorize('admin'), deleteMessage);

module.exports = router;
