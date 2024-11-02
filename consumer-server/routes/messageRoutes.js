const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');

// Message routes
router.get('/messages', messageController.getAllMessages);
router.get('/messages/topic/:topic', messageController.getMessagesByTopic);
router.get('/stats', messageController.getStats);

module.exports = router;