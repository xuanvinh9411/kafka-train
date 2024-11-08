const MessageQueue = require('../services/messageQueue');
const { kafka } = require('../config/kafka');
// 1. Custom Partitioner Implementation

class MessageController {
  static async sendMessage(req, res) {
    try {
      const { topic = 'test-topic', message } = req.body;

      if (!message) {
        return res.status(400).json({ 
          success: false, 
          error: 'Message is required' 
        });
      }

      const result = await MessageQueue.sendMessage(topic, message);
      
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
  }

  static async sendBatchMessages(req, res) {
    try {
      const { topic = 'test-topic', messages } = req.body;

      if (!Array.isArray(messages) || messages.length === 0) {
        return res.status(400).json({ 
          success: false, 
          error: 'Messages array is required' 
        });
      }

      const result = await MessageQueue.sendBatchMessages(topic, messages);

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
  }
  
  static async sendCustomMessage(req, res) {
    try {
      const { topic , message, } = req.body;

      if (!topic) {
        return res.status(400).json({
          success: false,
          error: 'Topic is required'
        });
      }
      if (!message) {
        return res.status(400).json({
          success: false,
          error: 'Message is required'
        });
      }

      const result = await MessageQueue.sendCustomMessage(topic, message);

      res.json({
        success: true,
        message: 'Custom message sent successfully',
        data: result,
      });
    } catch (error) {
      console.error('Error in sendCustomMessage controller:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to send custom message',
        message: error.message
      });
    }
  }

  static async topic(req, res) {
    try {
      const { topic = 'orders' } = req.body;
      console.log(`topic`, topic);
      const result = await MessageQueue.createTopic(topic);

      res.json({
        success: true,
        message: 'Topic created successfully',
        data: result
      });
    } catch (error) {
      console.error('Error in topic controller:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create topic',
        message: error.message
      });
    }
  }

  // Kiểm tra số partition hiện có
  static async  checkPartitions  (req, res) {
    const { topicName } = req.body;

  const admin = kafka.admin();
  try {
      const metadata = await admin.fetchTopicMetadata({
          topics: [topicName]
      });
      
      const partitionCount = metadata.topics[0].partitions.length;
      console.log(`Topic ${topicName} has ${partitionCount} partitions`);
      
      const result = {
          topic: topicName,
          partitions: metadata.topics[0].partitions.map(p => ({
              id: p.partitionId,
              leader: p.leader,
              replicas: p.replicas
          }))
      };
      res.json({
        success: true,
        message: 'Partitions checked successfully',
        data: result
      });
  } catch (error) {
      console.error('Error checking partitions:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to check partitions',
        message: error.message
      });
  }
};
}

module.exports = MessageController;