const express = require('express');
const bodyParser = require('body-parser');
const { connectProducer, disconnectProducer } = require('./config/kafka');
const messageRoutes = require('./routers/messageRoutes');
const { setupProducerEvents } = require('./config/events');
const app = express();
app.use(bodyParser.json());

// Routes
app.use('/api', messageRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Khởi động server
const startServer = async () => {
  try {
    // Kết nối Kafka
    await connectProducer();
    
    // Setup producer events
    // await  setupProducerEvents();
    
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Producer server running on port ${PORT}`);
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
    await disconnectProducer();
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