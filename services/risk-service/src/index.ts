import dotenv from 'dotenv';
dotenv.config({ path: 'env' });

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { Logger, LogLevel, KAFKA_TOPICS } from '@saga-pattern/shared';
import { KafkaProducer, KafkaConsumer } from '@saga-pattern/shared';
import kafka from './config/kafka';
import pool from './config/database';
import { CustomerRiskRepository } from './models/customer-risk';
import { RiskService } from './services/risk.service';
import { RiskController } from './controllers/risk.controller';
import { RiskEventHandler } from './event-handlers/risk.event-handler';
import { createRiskRoutes } from './routes/risk.routes';
import { initializeDatabase } from './database/init';

const PORT = process.env.PORT || 3000;
const logger = new Logger('risk-service', LogLevel.INFO);

async function startServer() {
  try {
    // Delay to allow DB to initialize
    await new Promise(res => setTimeout(res, 5000));

    // Initialize database
    await initializeDatabase();
    logger.info('Database initialized successfully');

    // Initialize Kafka producer and consumer
    const kafkaProducer = new KafkaProducer(kafka);
    const kafkaConsumer = new KafkaConsumer(kafka, 'risk-service-group');

    await kafkaProducer.connect();
    await kafkaConsumer.connect();
    logger.info('Kafka connections established');

    // Subscribe to topics
    await kafkaConsumer.subscribe(KAFKA_TOPICS.ORDER_EVENTS);
    logger.info('Subscribed to Kafka topics');

    // Initialize services
    const customerRiskRepository = new CustomerRiskRepository(pool);
    const riskService = new RiskService(customerRiskRepository, kafkaProducer, logger);
    const riskController = new RiskController(riskService, logger);
    const riskEventHandler = new RiskEventHandler(riskService, logger);

    // Setup event handlers
    riskEventHandler.setupEventHandlers(kafkaConsumer);

    // Start consuming events
    kafkaConsumer.run().catch((error: any) => {
      logger.error('Error in Kafka consumer', { error: error.message });
    });

    // Initialize Express app
    const app = express();

    // Middleware
    app.use(helmet());
    app.use(cors());
    app.use(express.json());

    // Routes
    app.use('/api/risk', createRiskRoutes(riskController));

    // Global error handler
    app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
      logger.error('Unhandled error', { error: err.message, stack: err.stack });
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    });

    // Start server
    app.listen(PORT, () => {
      logger.info(`Risk service started on port ${PORT}`);
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

  } catch (error: any) {
    logger.error('Failed to start server', { error: error.message });
    process.exit(1);
  }
}

startServer();
