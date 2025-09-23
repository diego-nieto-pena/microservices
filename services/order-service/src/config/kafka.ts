import { Kafka } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'order-service',
  brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
  retry: {
    initialRetryTime: 300, // 300ms
    retries: 10,
    maxRetryTime: 30000, // 30s
  },
});

export default kafka;
