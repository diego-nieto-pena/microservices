# Saga Pattern E-commerce Example

A comprehensive implementation of the **Saga Pattern** using Node.js, TypeScript, Docker, and Apache Kafka. This example demonstrates how to handle distributed transactions in a microservices architecture for an e-commerce application.

## 🏗️ Architecture Overview

This project implements a **choreography-based Saga pattern** with 4 microservices:

1. **Order Service** (Port 3001) - Creates and manages orders
2. **Risk Service** (Port 3002) - Validates customer credit risk
3. **Inventory Service** (Port 3003) - Manages product stock and reservations
4. **Payment Service** (Port 3004) - Processes payments and refunds

### Saga Flow

```
Order Request → Risk Check → Inventory Reserve → Payment Process → Order Complete
     ↓              ↓              ↓              ↓
   If any step fails, trigger compensating actions in reverse order
```

## 🚀 Quick Start

### Prerequisites

- Docker and Docker Compose
- Node.js 18+ (for local development)
- Git

### 1. Clone and Setup

```bash
git clone <repository-url>
cd microservices_patterns
```

### 2. Start the Infrastructure

```bash
# Start Kafka, Zookeeper, and PostgreSQL databases
docker-compose up -d zookeeper kafka postgres-order postgres-risk postgres-inventory postgres-payment

# Wait for services to be ready (about 30 seconds)
docker-compose logs -f
```

### 3. Start the Microservices

```bash
# Install dependencies
npm install

# Build shared libraries
cd shared && npm install && npm run build && cd ..

# Build and start all services
docker-compose up -d order-service risk-service inventory-service payment-service

# Or run locally for development
npm run dev
```

### 4. Verify Services

```bash
# Check service health
curl http://localhost:3001/api/orders/health
curl http://localhost:3002/api/risk/health
curl http://localhost:3003/api/inventory/health
curl http://localhost:3004/api/payments/health

# Check Kafka UI (optional)
open http://localhost:8080
```

## 📋 API Endpoints

### Order Service (Port 3001)

```bash
# Create an order
POST http://localhost:3001/api/orders
Content-Type: application/json

{
  "customerId": "customer-1",
  "items": [
    {
      "productId": "product-1",
      "quantity": 2,
      "price": 29.99
    }
  ]
}

# Get order by ID
GET http://localhost:3001/api/orders/{orderId}

# Get orders by customer
GET http://localhost:3001/api/orders/customer/{customerId}
```

### Risk Service (Port 3002)

```bash
# Get risk profile
GET http://localhost:3002/api/risk/profile/{customerId}

# Update risk profile
PUT http://localhost:3002/api/risk/profile/{customerId}
Content-Type: application/json

{
  "creditScore": 750,
  "maxOrderAmount": 2000
}
```

### Inventory Service (Port 3003)

```bash
# Get all products
GET http://localhost:3003/api/inventory/products

# Get product by ID
GET http://localhost:3003/api/inventory/products/{productId}

# Update product stock
PUT http://localhost:3003/api/inventory/products/{productId}/stock
Content-Type: application/json

{
  "stockQuantity": 100
}
```

### Payment Service (Port 3004)

```bash
# Get payment methods for customer
GET http://localhost:3004/api/payments/methods/{customerId}

# Get transactions by order
GET http://localhost:3004/api/payments/transactions/order/{orderId}

# Create payment method
POST http://localhost:3004/api/payments/methods
Content-Type: application/json

{
  "customerId": "customer-1",
  "type": "CREDIT_CARD",
  "lastFourDigits": "1234",
  "expiryMonth": 12,
  "expiryYear": 2025,
  "isDefault": true
}
```

## 🧪 Testing the Saga Pattern

### Success Scenario

1. **Create an order** with a valid customer and sufficient inventory:

```bash
curl -X POST http://localhost:3001/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": "customer-1",
    "items": [
      {
        "productId": "product-1",
        "quantity": 1,
        "price": 29.99
      }
    ]
  }'
```

2. **Monitor the saga flow** in the logs:

```bash
# Watch all service logs
docker-compose logs -f

# Or watch individual services
docker-compose logs -f order-service
docker-compose logs -f risk-service
docker-compose logs -f inventory-service
docker-compose logs -f payment-service
```

3. **Check the final order status**:

```bash
curl http://localhost:3001/api/orders/{orderId}
```

### Failure Scenarios

#### Risk Rejection
Create an order with a high-risk customer or high amount:

```bash
curl -X POST http://localhost:3001/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": "customer-3",
    "items": [
      {
        "productId": "product-1",
        "quantity": 10,
        "price": 299.90
      }
    ]
  }'
```

#### Inventory Insufficient
Create an order with more quantity than available:

```bash
curl -X POST http://localhost:3001/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": "customer-1",
    "items": [
      {
        "productId": "product-1",
        "quantity": 1000,
        "price": 29990.00
      }
    ]
  }'
```

#### Payment Failure
The payment service has a 10% failure rate for demonstration. Try multiple orders to see payment failures.

## 🔄 Saga Pattern Implementation Details

### Event Flow

1. **OrderCreated** → Risk Service assesses customer risk
2. **RiskApproved** → Inventory Service reserves stock
3. **InventoryReserved** → Payment Service processes payment
4. **PaymentProcessed** → Order Service completes order

### Compensating Actions

When any step fails, compensating actions are triggered:

1. **Risk Rejection** → Order cancelled
2. **Inventory Insufficient** → Order cancelled
3. **Payment Failed** → Inventory released, Order cancelled

### Event Schema

All events follow a consistent schema:

```typescript
interface BaseEvent {
  eventId: string;
  eventType: string;
  timestamp: Date;
  sagaId: string;
  correlationId: string;
  data: any;
}
```

## 🛠️ Development

### Project Structure

```
microservices_patterns/
├── shared/                          # Shared libraries
│   ├── src/
│   │   ├── types/                   # Event and domain types
│   │   ├── utils/                   # Utilities (logger, event builder)
│   │   └── kafka/                   # Kafka producer/consumer
│   └── package.json
├── services/
│   ├── order-service/               # Order management
│   ├── risk-service/                # Credit risk assessment
│   ├── inventory-service/           # Stock management
│   └── payment-service/             # Payment processing
├── docker-compose.yml               # Infrastructure setup
└── README.md
```

### Local Development

```bash
# Install dependencies
npm install
cd shared && npm install && cd ..

# Start infrastructure only
docker-compose up -d zookeeper kafka postgres-order postgres-risk postgres-inventory postgres-payment

# Run services locally
npm run dev

# Or run individual services
npm run dev:order
npm run dev:risk
npm run dev:inventory
npm run dev:payment
```

### Building for Production

```bash
# Build all services
npm run build

# Start with Docker Compose
docker-compose up -d
```

## 📊 Monitoring

### Kafka UI
Access the Kafka UI at http://localhost:8080 to monitor:
- Topics and partitions
- Message flow
- Consumer groups
- Message content

### Service Logs
All services use structured JSON logging with:
- Service name
- Log level
- Timestamp
- Saga ID and correlation ID for tracing
- Contextual metadata

### Health Checks
Each service exposes a health endpoint:
- Order Service: `GET /api/orders/health`
- Risk Service: `GET /api/risk/health`
- Inventory Service: `GET /api/inventory/health`
- Payment Service: `GET /api/payments/health`

## 🔧 Configuration

### Environment Variables

Each service can be configured with:

```bash
NODE_ENV=development
PORT=3000
KAFKA_BROKER=localhost:9092
DATABASE_URL=postgresql://user:pass@host:port/db
LOG_LEVEL=info
```

### Database Configuration

Each service has its own PostgreSQL database:
- Order Service: `orderdb` (Port 5432)
- Risk Service: `riskdb` (Port 5433)
- Inventory Service: `inventorydb` (Port 5434)
- Payment Service: `paymentdb` (Port 5435)

## 🧪 Testing

### Unit Tests

```bash
# Run all tests
npm test

# Run tests for specific service
cd services/order-service && npm test
```

### Integration Tests

```bash
# Start the full stack
docker-compose up -d

# Run integration tests
npm run test:integration
```

## 🚨 Troubleshooting

### Common Issues

1. **Services not starting**: Check if Kafka and databases are ready
2. **Database connection errors**: Ensure PostgreSQL containers are running
3. **Kafka connection errors**: Check if Zookeeper is running
4. **Event not processed**: Check service logs and Kafka UI

### Debug Commands

```bash
# Check container status
docker-compose ps

# View service logs
docker-compose logs -f [service-name]

# Check database connections
docker-compose exec postgres-order psql -U orderuser -d orderdb -c "SELECT 1;"

# Check Kafka topics
docker-compose exec kafka kafka-topics --bootstrap-server localhost:9092 --list
```

## 📚 Learning Resources

### Saga Pattern Concepts

- [Saga Pattern - Microservices.io](https://microservices.io/patterns/data/saga.html)
- [Event Sourcing and CQRS](https://martinfowler.com/eaaDev/EventSourcing.html)
- [Choreography vs Orchestration](https://www.oreilly.com/library/view/building-microservices/9781491950340/ch04.html)

### Technologies Used

- [Apache Kafka Documentation](https://kafka.apache.org/documentation/)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Docker Compose Reference](https://docs.docker.com/compose/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Inspired by the Saga pattern described in "Microservices Patterns" by Chris Richardson
- Built with modern Node.js and TypeScript best practices
- Uses Apache Kafka for reliable event streaming
