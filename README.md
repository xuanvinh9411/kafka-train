# 🚀 Docker Kafka Development Environment

Simplified Kafka cluster setup using Docker Compose. Production-ready configuration for local development with monitoring UI.

## 🎯 Key Features
- Single-command cluster deployment
- Kafka & Zookeeper with persistence
- Built-in monitoring UI
- Sample producers/consumers
- Production-like configurations

## 🛠 Tech Stack
- Apache Kafka
- Apache Zookeeper
- Kafka UI
- Docker & Docker Compose

## 🔥 Quick Start
```bash
# Start the cluster
docker-compose up -d

# Create a topic
docker-compose exec kafka kafka-topics --create \
  --topic my-topic \
  --bootstrap-server localhost:9092 \
  --partitions 3 \
  --replication-factor 1

# Access UI
http://localhost:8080
```

## 📚 What's Inside
- Kafka Broker (latest)
- Zookeeper (latest)
- Kafka UI
- Network isolation
- Persistent volumes
- Sample configurations

## 🎮 Management UI Features
- Topic Management
- Consumer Groups
- Message Browser
- Cluster Config
- Performance Metrics

## 🔧 Configuration
- Custom retention policies
- Configurable partitions
- Adjustable volume sizes
- Flexible networking
- Security options

## 📖 Documentation
Detailed documentation available in [docs/](docs/) directory.

## 🤝 Contributing
Contributions welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md)

## 📄 License
MIT Licensed. See [LICENSE](LICENSE)

## 🌟 If you find this helpful, please star!

---
Built with ❤️ by [CrimsonJS](https://github.com/yourusername)