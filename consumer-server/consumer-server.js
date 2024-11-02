const express = require('express');
const bodyParser = require('body-parser');
const { connectConsumer, disconnectConsumer } = require('./config/kafka');
const messageRoutes = require('./routes/messageRoutes');
const { setupConsumerEvents } = require('./config/events');

const app = express();
app.use(bodyParser.json());

// Routes
app.use('/api', messageRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Khởi động server và consumer
const startServer = async () => {
  try {
    // Kết nối Kafka
    await connectConsumer();
    
    // Setup consumer events
    setupConsumerEvents();
    setupConsumerEvents();
    // Bắt đầu xử lý messages
    await startConsumer();
    
    // Khởi động server
    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
      console.log(`Consumer server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Graceful shutdown
let isShuttingDown = false;

async function shutdown() {
  if (isShuttingDown) return;
  isShuttingDown = true;

  console.log('Graceful shutdown initiated...');
  
  try {
    // Dừng consumer trước
    await stopConsumer();
    
    // Đóng kết nối Kafka
    await disconnectConsumer();
    
    console.log('Shutdown completed');
    process.exit(0);
  } catch (error) {
    console.error('Error during shutdown:', error);
    process.exit(1);
  }
}

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

// Start server
startServer();