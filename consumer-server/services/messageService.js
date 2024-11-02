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

module.exports = {
  addMessage,
  getMessages,
  getMessagesByTopic,
  getMessageStats
};