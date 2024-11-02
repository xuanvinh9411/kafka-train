const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'consumer-app',
  brokers: ['localhost:9092']
});

const consumer = kafka.consumer({ groupId: 'test-group' });

const connectConsumer = async () => {
  try {
    await consumer.connect();
    console.log('Consumer connected to Kafka successfully');
    return consumer;
  } catch (error) {
    console.error('Failed to connect consumer:', error);
    throw error;
  }
};

const disconnectConsumer = async () => {
  try {
    await consumer.disconnect();
    console.log('Consumer disconnected successfully');
  } catch (error) {
    console.error('Error disconnecting consumer:', error);
    throw error;
  }
};

module.exports = {
  kafka,
  consumer,
  connectConsumer,
  disconnectConsumer
};
