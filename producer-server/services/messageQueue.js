const { producer, kafka } = require('../config/kafka');

class MessageQueue {
  static async retryOperation(operation, maxRetries = 3, delay = 1000) {
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await operation();
      } catch (error) {
        if (i === maxRetries - 1) throw error;
        console.log(`Retry attempt ${i + 1} after ${delay}ms`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  static async sendMessage(topic, message) {
    try {
      const messagePayload = {
        content: message,
        timestamp: new Date().toISOString()
      };

      const result = await this.retryOperation(async () => {
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
  }

  static async sendBatchMessages(topic, messages) {
    try {
      const kafkaMessages = messages.map(message => ({
        value: JSON.stringify({
          content: message,
          timestamp: new Date().toISOString()
        })
      }));

      const result = await this.retryOperation(async () => {
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
  }

  static async sendCustomMessage(topic, message, acks = -1) {
    try {
      const result = await this.retryOperation(async () => {
        return await producer.send({
          topic,
          acks,

          messages: [{
            key: message.key,
            value: JSON.stringify(message.value),
            partition: message.partition,
            headers: message.headers,
            timestamp: Date.now()
          }]
        });
      });

      console.log('Custom message sent successfully:', result);
      return { success: true, result };
    } catch (error) {
      console.error('Error sending custom message:', error);
      throw error;
    }
  }

  static async checkPartition(topic, message) {
    // 1. Kiểm tra số partition có sẵn
    const metadata = await admin.fetchTopicMetadata({
      topics: [topic]
    });

    const availablePartitions = metadata.topics[0].partitions.length;
    console.log(`Topic ${topic} has ${availablePartitions} partitions`);

    // 2. Validate partition number
    if (message.partition !== undefined) {
      if (message.partition < 0 || message.partition >= availablePartitions) {
        throw new Error(
          `Invalid partition ${message.partition}. Topic ${topic} has ${availablePartitions} partitions (0-${availablePartitions - 1})`
        );
      }
    }
    return { success: true, availablePartitions };
  }

  static async createTopic(topicName) {
    try {
      // Tạo admin để tạo topic

      const admin = kafka.admin();
      // 1. Kiểm tra kết nối
      await admin.connect();

      // 2. Kiểm tra cluster health
      const clusterInfo = await admin.describeCluster();
      console.log('Available brokers:', clusterInfo.brokers);

      // 3. Kiểm tra và xóa topic cũ
      const topics = await admin.listTopics();
      if (topics.includes(topicName)) {
        await admin.deleteTopics({
          topics: [topicName]
        });

        // Đợi cho việc xóa hoàn tất
        await new Promise(resolve => setTimeout(resolve, 5000));
      }

      // 3. Đợi một khoảng thời gian để Kafka cleanup

      const result = await admin.createTopics({
        topics: [{
          topic: topicName,
          numPartitions: 3,  // Bắt đầu với 1 partition
          replicationFactor: 1,
          configEntries: [
            {
              name: 'cleanup.policy',
              value: 'delete'
            }
          ]
        }],
        waitForLeaders: true  // Đợi cho leader được bầu chọn
      });

      // 5. Verify topic creation
      await new Promise(resolve => setTimeout(resolve, 2000));
      const newTopicMetadata = await admin.fetchTopicMetadata({
        topics: [topicName]
      });

      return {
        success: true,
        result,
        topic: newTopicMetadata.topics[0].name,
        partitions: newTopicMetadata.topics[0].partitions.length,
        metadata: newTopicMetadata.topics[0]
      };
    } catch (error) {
      console.error('Error creating topic:', error);
      throw error;
    }
  }
}

module.exports = MessageQueue;