const { consumer } = require('../config/kafka');

const messages = [];
const MAX_MESSAGES = 1000;

const addMessage = (message) => {
  messages.unshift(message); // Thêm vào đầu mảng
  if (messages.length > MAX_MESSAGES) {
    messages.pop(); // Xóa message cũ nhất
  }
};

const getMessages = (limit = 100, offset = 0) => {
  return messages.slice(offset, offset + limit);
};

const getMessagesByTopic = (topic, limit = 100) => {
  return messages.filter(msg => msg.topic === topic).slice(0, limit);
};

const getMessageStats = () => {
  const topics = {};
  messages.forEach(msg => {
    topics[msg.topic] = (topics[msg.topic] || 0) + 1;
  });

  return {
    totalMessages: messages.length,
    topicStats: topics,
    lastMessageTime: messages[0]?.timestamp || null
  };
};

const startConsumer = async () => {
  try {
    // Subscribe to all topics starting with 'test-'
    await consumer.subscribe({ topics: ['topicdev-1'], fromBeginning: true });

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        try {
          const messageContent = {
            topic,
            partition,
            offset: message.offset,
            value: message.value.toString(),
            timestamp: new Date(parseInt(message.timestamp)),
            headers: message.headers
          };
          
          addMessage(messageContent);
          console.log(`Processed message from topic ${topic}:`, messageContent);
        } catch (error) {
          console.error('Error processing message:', error);
        }
      }
    });

    console.log('Consumer started successfully');
  } catch (error) {
    console.error('Error starting consumer:', error);
    throw error;
  }
};

const stopConsumer = async () => {
  try {
    await consumer.stop();
    console.log('Consumer stopped successfully');
  } catch (error) {
    console.error('Error stopping consumer:', error);
    throw error;
  }
};

module.exports = {
  addMessage,
  getMessages,
  getMessagesByTopic,
  getMessageStats,
  startConsumer
};