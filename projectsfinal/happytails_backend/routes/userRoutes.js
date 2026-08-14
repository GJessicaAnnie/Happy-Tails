const express = require('express');
const router = express.Router();
const { getUsers, getUser, updateUser, deleteUser, getDoctors } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

router.get('/doctors', getDoctors);
router.get('/', protect, authorize('admin'), getUsers);
router.get('/:id', protect, getUser);
router.put('/:id', protect, updateUser);
router.delete('/:id', protect, authorize('admin'), deleteUser);

module.exports = router;
