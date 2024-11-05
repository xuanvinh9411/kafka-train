// config/events.js
const { consumer } = require('./kafka');

const setupConsumerEvents = () => {
  // Basic connection events
  consumer.on('consumer.connect', () => {
    console.log('Consumer connected to Kafka');
  });

  consumer.on('consumer.disconnect', () => {
    console.log('Consumer disconnected from Kafka');
  });

  // Group membership events
  consumer.on('consumer.group.join', ({ payload }) => {
    console.log('Consumer joined group:', payload);
  });

  consumer.on('consumer.group.leave', ({ payload }) => {
    console.log('Consumer left group:', payload);
  });

  // Error handling events
  consumer.on('consumer.network.request_timeout', (error) => {
    console.error('Consumer network timeout:', error);
    // Add monitoring system notification logic if needed
  });

  consumer.on('consumer.network.error', (error) => {
    console.error('Consumer network error:', error);
    // Add retry connection logic if needed
  });

  // Processing events
  consumer.on('consumer.crash', (error) => {
    console.error('Consumer crashed:', error);
    // Add recovery logic
  });

  consumer.on('consumer.rebalancing', () => {
    console.log('Consumer rebalancing partitions');
  });
};

// Individual event handlers
const onConsumerConnect = () => {
  console.log('Consumer connected to Kafka');
  // Add additional initialization logic if needed
};

const onConsumerDisconnect = () => {
  console.log('Consumer disconnected from Kafka');
  // Add cleanup logic if needed
};

const onConsumerError = (error) => {
  console.error('Consumer error:', error);
  // Add error handling logic
};

module.exports = {
  setupConsumerEvents,
  onConsumerConnect, 
  onConsumerDisconnect,
  onConsumerError
};
