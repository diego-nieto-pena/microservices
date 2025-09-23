"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const shared_1 = require("@saga-pattern/shared");
const shared_2 = require("@saga-pattern/shared");
const kafka_1 = __importDefault(require("./config/kafka"));
const database_1 = __importDefault(require("./config/database"));
const order_1 = require("./models/order");
const order_service_1 = require("./services/order.service");
const order_controller_1 = require("./controllers/order.controller");
const order_event_handler_1 = require("./event-handlers/order.event-handler");
const order_routes_1 = require("./routes/order.routes");
const init_1 = require("./database/init");
const PORT = process.env.PORT || 3000;
const logger = new shared_1.Logger('order-service', shared_1.LogLevel.INFO);
async function startServer() {
    try {
        // Initialize database
        await (0, init_1.initializeDatabase)();
        logger.info('Database initialized successfully');
        // Initialize Kafka producer and consumer
        const kafkaProducer = new shared_2.KafkaProducer(kafka_1.default);
        const kafkaConsumer = new shared_2.KafkaConsumer(kafka_1.default, 'order-service-group');
        await kafkaProducer.connect();
        await kafkaConsumer.connect();
        logger.info('Kafka connections established');
        // Subscribe to topics
        await kafkaConsumer.subscribe(shared_1.KAFKA_TOPICS.RISK_EVENTS);
        await kafkaConsumer.subscribe(shared_1.KAFKA_TOPICS.INVENTORY_EVENTS);
        await kafkaConsumer.subscribe(shared_1.KAFKA_TOPICS.PAYMENT_EVENTS);
        logger.info('Subscribed to Kafka topics');
        // Initialize services
        const orderRepository = new order_1.OrderRepository(database_1.default);
        const orderService = new order_service_1.OrderService(orderRepository, kafkaProducer, logger);
        const orderController = new order_controller_1.OrderController(orderService, logger);
        const orderEventHandler = new order_event_handler_1.OrderEventHandler(orderService, logger);
        // Setup event handlers
        orderEventHandler.setupEventHandlers(kafkaConsumer);
        // Start consuming events
        kafkaConsumer.run().catch((error) => {
            logger.error('Error in Kafka consumer', { error: error instanceof Error ? error.message : String(error) });
        });
        // Initialize Express app
        const app = (0, express_1.default)();
        // Middleware
        app.use((0, helmet_1.default)());
        app.use((0, cors_1.default)());
        app.use(express_1.default.json());
        // Routes
        app.use('/api/orders', (0, order_routes_1.createOrderRoutes)(orderController));
        // Global error handler
        app.use((err, req, res, next) => {
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
            await database_1.default.end();
            process.exit(0);
        });
        process.on('SIGINT', async () => {
            logger.info('SIGINT received, shutting down gracefully');
            await kafkaProducer.disconnect();
            await kafkaConsumer.disconnect();
            await database_1.default.end();
            process.exit(0);
        });
    }
    catch (error) {
        logger.error('Failed to start server', { error: error instanceof Error ? error.message : String(error) });
        process.exit(1);
    }
}
startServer();
