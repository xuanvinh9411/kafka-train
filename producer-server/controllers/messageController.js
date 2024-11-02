const messageQueue = require('../services/messageQueue');

const sendMessage = async (req, res) => {
  try {
    const { topic = 'test-topic', message } = req.body;

    if (!message) {
      return res.status(400).json({ 
        success: false, 
        error: 'Message is required' 
      });
    }

    const result = await messageQueue.sendMessage(topic, message);
    
    res.json({
      success: true,
      message: 'Message sent successfully',
      data: result
    });
  } catch (error) {
    console.error('Error in sendMessage controller:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to send message',
      message: error.message 
    });
  }
};

const sendBatchMessages = async (req, res) => {
  try {
    const { topic = 'test-topic', messages } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'Messages array is required' 
      });
    }

    const result = await messageQueue.sendBatchMessages(topic, messages);

    res.json({
      success: true,
      message: 'Batch messages sent successfully',
      data: result
    });
  } catch (error) {
    console.error('Error in sendBatchMessages controller:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to send batch messages',
      message: error.message
    });
  }
};

module.exports = {
  sendMessage,
  sendBatchMessages
};