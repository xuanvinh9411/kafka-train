const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');

router.post('/send', messageController.sendMessage);
router.post('/send-batch', messageController.sendBatchMessages);

module.exports = router;