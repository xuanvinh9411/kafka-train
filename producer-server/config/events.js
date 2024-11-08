// config/events.js
const { producer } = require('./kafka');

const setupProducerEvents = () => {
  // Basic events
  producer.on('producer.connect', () => {
    console.log('Producer connected to Kafka');
  });

  producer.on('producer.disconnect', () => {
    console.log('Producer disconnected from Kafka');
  });

  // Error handling events
  producer.on('producer.network.request_timeout', (error) => {
    console.error('Producer network timeout:', error);
    // Có thể thêm logic notify monitoring system
  });

  // producer.on('producer.network.error', (error) => {
  //   console.error('Producer network error:', error);
  //   // Có thể thêm logic retry connection
  // });

};

// Event handlers riêng biệt
const onProducerConnect = () => {
  console.log('Producer connected to Kafka');
  // Thêm logic khởi tạo khác nếu cần
};

const onProducerDisconnect = () => {
  console.log('Producer disconnected from Kafka');
  // Cleanup logic nếu cần
};

const onProducerError = (error) => {
  console.error('Producer error:', error);
  // Error handling logic
};

module.exports = {
  setupProducerEvents,
  onProducerConnect,
  onProducerDisconnect,
  onProducerError
};