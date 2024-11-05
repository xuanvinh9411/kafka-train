const messageService = require('../services/messageService');

const getAllMessages = (req, res) => {
  try {
    const { limit = 100, offset = 0 } = req.query;
    const messages = messageService.getMessages(parseInt(limit), parseInt(offset));
    res.json({
      success: true,
      data: messages,
      pagination: {
        limit: parseInt(limit),
        offset: parseInt(offset),
        total: messages.length
      }
    });
  } catch (error) {
    console.error('Error in getAllMessages:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

const getMessagesByTopic = (req, res) => {
  try {
    const { topic } = req.params;
    const { limit = 100 } = req.query;
    const messages = messageService.getMessagesByTopic(topic, parseInt(limit));
    res.json({
      success: true,
      topic,
      data: messages,
      count: messages.length
    });
  } catch (error) {
    console.error('Error in getMessagesByTopic:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

const getStats = (req, res) => {
  try {
    const stats = messageService.getMessageStats();
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error in getStats:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};
const startConsumer = async ( ) => {
  try {
    await messageService.startConsumer();
    console.log('Consumer started successfully');

  } catch (error) {
    console.error('Error in startConsumer:', error);
  }
};

module.exports = {
  getAllMessages,
  getMessagesByTopic,
  getStats,
  startConsumer
};
