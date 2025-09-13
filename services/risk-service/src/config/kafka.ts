import { Kafka } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'risk-service',
  brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
  retry: {
    initialRetryTime: 100,
    retries: 8,
  },
});

export default kafka;
