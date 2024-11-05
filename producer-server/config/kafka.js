const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'producer-app',
  brokers: ['localhost:29092']
});

const producer = kafka.producer({
    allowAutoTopicCreation: true,
    transactionTimeout: 30000
  });

const connectProducer = async () => {
  try {
    await producer.connect();
    console.log('Producer connected to Kafka successfully');
    return producer;
  } catch (error) {
    console.error('Failed to connect producer:', error);
    throw error;
  }
};

const disconnectProducer = async () => {
  try {
    await producer.disconnect();
    console.log('Producer disconnected successfully');
  } catch (error) {
    console.error('Error disconnecting producer:', error);
    throw error;
  }
};

module.exports = {
  kafka,
  producer,
  connectProducer,
  disconnectProducer
};
