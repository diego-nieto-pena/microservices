import dotenv from 'dotenv';
dotenv.config({ path: 'env' });

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { Logger, LogLevel, KAFKA_TOPICS } from '@saga-pattern/shared';
import { KafkaProducer, KafkaConsumer } from '@saga-pattern/shared';
import kafka from './config/kafka';
import pool from './config/database';
import { OrderRepository } from './models/order';
import { OrderService } from './services/order.service';
import { OrderController } from './controllers/order.controller';
import { OrderEventHandler } from './event-handlers/order.event-handler';
import { createOrderRoutes } from './routes/order.routes';
import { initializeDatabase } from './database/init';

const PORT = process.env.PORT || 3000;
const logger = new Logger('order-service', LogLevel.INFO);

async function startServer() {
  try {
    // Initialize database with retry logic
    let dbAttempts = 0;
    const maxDbAttempts = 5;
    const dbRetryDelay = 3000; // 3 seconds

    while (dbAttempts < maxDbAttempts) {
      try {
        await initializeDatabase();
        logger.info('Database initialized successfully');
        break; // Exit loop on success
      } catch (error: any) {
        dbAttempts++;
        if (dbAttempts >= maxDbAttempts) {
          logger.error('Failed to initialize database after multiple attempts', { error: error.message });
          throw error;
        }
        logger.warn(`Failed to initialize database, retrying in ${dbRetryDelay / 1000}s...`, { attempt: dbAttempts, error: error.message });
        await new Promise(res => setTimeout(res, dbRetryDelay));
      }
    }

    // Initialize Kafka producer and consumer
    const kafkaProducer = new KafkaProducer(kafka);
    const kafkaConsumer = new KafkaConsumer(kafka, 'order-service-group');

    await kafkaProducer.connect();
    await kafkaConsumer.connect();
    logger.info('Kafka connections established');

    // Subscribe to topics with retry logic
    const topicsToSubscribe = [
      KAFKA_TOPICS.RISK_EVENTS,
      KAFKA_TOPICS.INVENTORY_EVENTS,
      KAFKA_TOPICS.PAYMENT_EVENTS,
    ];
    let attempts = 0;
    const maxAttempts = 5;
    const retryDelay = 3000; // 3 seconds

    while (attempts < maxAttempts) {
      try {
        await Promise.all(topicsToSubscribe.map(topic => kafkaConsumer.subscribe(topic)));
        logger.info('Successfully subscribed to Kafka topics');
        break; // Exit loop on success
      } catch (error: any) {
        attempts++;
        if (attempts >= maxAttempts) {
          logger.error('Failed to subscribe to Kafka topics after multiple attempts', { error: error.message });
          throw error;
        }
        logger.warn(`Failed to subscribe to topics, retrying in ${retryDelay / 1000}s...`, { attempt: attempts, error: error.message });
        await new Promise(res => setTimeout(res, retryDelay));
      }
    }

    // Initialize services
    const orderRepository = new OrderRepository(pool);
    const orderService = new OrderService(orderRepository, kafkaProducer, logger);
    const orderController = new OrderController(orderService, logger);
    const orderEventHandler = new OrderEventHandler(orderService, logger);

    // Setup event handlers
    orderEventHandler.setupEventHandlers(kafkaConsumer);

    // Start consuming events
    kafkaConsumer.run().catch((error: any) => {
      logger.error('Error in Kafka consumer', { error: error instanceof Error ? error.message : String(error) });
    });

    // Initialize Express app
    const app = express();

    // Middleware
    app.use(helmet());
    app.use(cors());
    app.use(express.json());

    // Routes
    app.use('/api/orders', createOrderRoutes(orderController));

    // Global error handler
    app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
      logger.error('Unhandled error', { error: err instanceof Error ? err.message : String(err), stack: err instanceof Error ? err.stack : undefined });
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    });

    // Start server
    app.listen(PORT, () => {
      logger.info(`Order service started on port ${PORT}`);
    });

    // Graceful shutdown
    process.on('SIGTERM', async () => {
      logger.info('SIGTERM received, shutting down gracefully');
      await kafkaProducer.disconnect();
      await kafkaConsumer.disconnect();
      await pool.end();
      process.exit(0);
    });

    process.on('SIGINT', async () => {
      logger.info('SIGINT received, shutting down gracefully');
      await kafkaProducer.disconnect();
      await kafkaConsumer.disconnect();
      await pool.end();
      process.exit(0);
    });

  } catch (error) {
    logger.error('Failed to start server', { error: error instanceof Error ? error.message : String(error) });
    process.exit(1);
  }
}

startServer();
