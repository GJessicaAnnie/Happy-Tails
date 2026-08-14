const ContactMessage = require('../models/ContactMessage');
const { asyncHandler } = require('../middleware/error');

// @desc    Submit contact message
// @route   POST /api/contact
// @access  Public
exports.submitMessage = asyncHandler(async (req, res) => {
  const { name, email, subject, message } = req.body;

  const contactMessage = await ContactMessage.create({
    name,
    email,
    subject,
    message
  });

  res.status(201).json({
    success: true,
    message: 'Message sent successfully. We will get back to you soon!',
    data: { contactMessage }
  });
});

// @desc    Get all messages
// @route   GET /api/contact
// @access  Private/Admin
exports.getAllMessages = asyncHandler(async (req, res) => {
  const { status } = req.query;

  let query = {};

  if (status) {
    query.status = status;
  }

  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const skip = (page - 1) * limit;

  const messages = await ContactMessage.find(query)
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  const total = await ContactMessage.countDocuments(query);

  res.status(200).json({
    success: true,
    count: messages.length,
    total,
    page,
    pages: Math.ceil(total / limit),
    data: { messages }
  });
});

// @desc    Get single message
// @route   GET /api/contact/:id
// @access  Private/Admin
exports.getMessage = asyncHandler(async (req, res) => {
  const message = await ContactMessage.findById(req.params.id);

  if (!message) {
    return res.status(404).json({
      success: false,
      message: 'Message not found'
    });
  }

  // Mark as read
  if (message.status === 'unread') {
    message.status = 'read';
    await message.save();
  }

  res.status(200).json({
    success: true,
    data: { message }
  });
});

// @desc    Update message status
// @route   PUT /api/contact/:id/status
// @access  Private/Admin
exports.updateMessageStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  const message = await ContactMessage.findById(req.params.id);

  if (!message) {
    return res.status(404).json({
      success: false,
      message: 'Message not found'
    });
  }

  message.status = status;
  
  if (status === 'replied') {
    message.repliedAt = Date.now();
    message.repliedBy = req.user.id;
  }

  await message.save();

  res.status(200).json({
    success: true,
    message: 'Message status updated',
    data: { message }
  });
});

// @desc    Delete message
// @route   DELETE /api/contact/:id
// @access  Private/Admin
exports.deleteMessage = asyncHandler(async (req, res) => {
  const message = await ContactMessage.findById(req.params.id);

  if (!message) {
    return res.status(404).json({
      success: false,
      message: 'Message not found'
    });
  }

  await message.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Message deleted successfully'
  });
});

// @desc    Get message statistics
// @route   GET /api/contact/stats
// @access  Private/Admin
exports.getMessageStats = asyncHandler(async (req, res) => {
  const stats = await ContactMessage.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);

  const totalMessages = await ContactMessage.countDocuments();
  const unreadMessages = await ContactMessage.countDocuments({ status: 'unread' });

  res.status(200).json({
    success: true,
    data: {
      totalMessages,
      unreadMessages,
      byStatus: stats
    }
  });
});
