const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');

router.post('/send', messageController.sendMessage);
router.post('/send-batch', messageController.sendBatchMessages);
router.post('/send-custom-message', messageController.sendCustomMessage);
router.post('/admin-topic', messageController.topic);
router.get('/check-partitions', messageController.checkPartitions);

module.exports = router;