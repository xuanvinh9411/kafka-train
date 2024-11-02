const { producer } = require('../config/kafka');

const retryOperation = async (operation, maxRetries = 3, delay = 1000) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      console.log(`Retry attempt ${i + 1} after ${delay}ms`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};

const sendMessage = async (topic, message) => {
  try {
    const messagePayload = {
      content: message,
      timestamp: new Date().toISOString()
    };

    const result = await retryOperation(async () => {
      return await producer.send({
        topic,
        messages: [{ value: JSON.stringify(messagePayload) }]
      });
    });

    console.log('Message sent successfully:', { topic, messagePayload });
    return { success: true, result, messagePayload };
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

const sendBatchMessages = async (topic, messages) => {
  try {
    const kafkaMessages = messages.map(message => ({
      value: JSON.stringify({
        content: message,
        timestamp: new Date().toISOString()
      })
    }));

    const result = await retryOperation(async () => {
      return await producer.send({
        topic,
        messages: kafkaMessages
      });
    });

    console.log(`Batch of ${messages.length} messages sent successfully to topic:`, topic);
    return { success: true, result, count: messages.length };
  } catch (error) {
    console.error('Error sending batch messages:', error);
    throw error;
  }
};



module.exports = {
  sendMessage,
  sendBatchMessages,
  retryOperation
};