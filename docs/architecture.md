# Architecture Documentation

## System Overview

This implementation demonstrates the **Saga Pattern** using a **choreography-based approach** in a microservices architecture. The system consists of 4 microservices that communicate through events using Apache Kafka.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                                E-commerce Saga System                          │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐     │
│  │   Order     │    │    Risk     │    │ Inventory   │    │  Payment    │     │
│  │  Service    │    │  Service    │    │  Service    │    │  Service    │     │
│  │  (Port 3001)│    │  (Port 3002)│    │  (Port 3003)│    │  (Port 3004)│     │
│  └─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘     │
│         │                   │                   │                   │         │
│         │                   │                   │                   │         │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐     │
│  │ PostgreSQL  │    │ PostgreSQL  │    │ PostgreSQL  │    │ PostgreSQL  │     │
│  │  (Port 5432)│    │  (Port 5433)│    │  (Port 5434)│    │  (Port 5435)│     │
│  └─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘     │
│                                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │                        Apache Kafka (Port 9092)                        │   │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐      │   │
│  │  │Order Events │ │Risk Events  │ │Inventory    │ │Payment      │      │   │
│  │  │   Topic     │ │   Topic     │ │Events Topic │ │Events Topic │      │   │
│  │  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘      │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │                        Zookeeper (Port 2181)                           │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────────┘
```

## Saga Flow Diagram

```
Order Request
     │
     ▼
┌─────────────┐
│Order Service│ ──► OrderCreated Event
└─────────────┘
     │
     ▼
┌─────────────┐
│Risk Service │ ──► RiskApproved/RiskRejected Event
└─────────────┘
     │
     ▼
┌─────────────┐
│Inventory    │ ──► InventoryReserved/InventoryInsufficient Event
│Service      │
└─────────────┘
     │
     ▼
┌─────────────┐
│Payment      │ ──► PaymentProcessed/PaymentFailed Event
│Service      │
└─────────────┘
     │
     ▼
┌─────────────┐
│Order Service│ ──► OrderCompleted Event
└─────────────┘
```

## Compensating Actions Flow

```
Order Cancellation
     │
     ▼
┌─────────────┐
│Order Service│ ──► OrderCancelled Event
└─────────────┘
     │
     ▼
┌─────────────┐
│Inventory    │ ──► InventoryReleased Event
│Service      │
└─────────────┘
     │
     ▼
┌─────────────┐
│Payment      │ ──► PaymentRefunded Event
│Service      │
└─────────────┘
```

## Event Schema

All events follow a consistent schema:

```typescript
interface BaseEvent {
  eventId: string;        // Unique event identifier
  eventType: string;      // Event type (e.g., "OrderCreated")
  timestamp: Date;        // Event timestamp
  sagaId: string;         // Saga identifier for correlation
  correlationId: string;  // Correlation identifier
  data: any;             // Event-specific data
}
```

## Service Responsibilities

### Order Service
- **Primary Role**: Saga orchestrator and order management
- **Database**: PostgreSQL (orderdb)
- **Key Operations**:
  - Create orders
  - Track order status
  - Publish OrderCreated events
  - Handle saga completion/cancellation
- **Events Published**: OrderCreated, OrderCompleted, OrderCancelled
- **Events Consumed**: RiskApproved, RiskRejected, InventoryReserved, InventoryInsufficient, PaymentProcessed, PaymentFailed

### Risk Service
- **Primary Role**: Credit risk assessment
- **Database**: PostgreSQL (riskdb)
- **Key Operations**:
  - Assess customer credit risk
  - Validate order amounts against credit limits
  - Maintain customer risk profiles
- **Events Published**: RiskApproved, RiskRejected
- **Events Consumed**: OrderCreated, OrderCancelled

### Inventory Service
- **Primary Role**: Stock management and reservations
- **Database**: PostgreSQL (inventorydb)
- **Key Operations**:
  - Reserve inventory for orders
  - Release inventory on cancellation
  - Manage product stock levels
- **Events Published**: InventoryReserved, InventoryReleased, InventoryInsufficient
- **Events Consumed**: RiskApproved, RiskRejected, OrderCancelled

### Payment Service
- **Primary Role**: Payment processing and refunds
- **Database**: PostgreSQL (paymentdb)
- **Key Operations**:
  - Process payments
  - Handle refunds
  - Manage payment methods
- **Events Published**: PaymentProcessed, PaymentFailed, PaymentRefunded
- **Events Consumed**: InventoryReserved, InventoryInsufficient, OrderCancelled

## Technology Stack

### Backend
- **Runtime**: Node.js 18+
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL 15
- **Message Broker**: Apache Kafka
- **Containerization**: Docker & Docker Compose

### Shared Libraries
- **Event Schema**: Zod for validation
- **Logging**: Custom structured logger
- **Kafka**: KafkaJS for producer/consumer
- **Database**: pg (PostgreSQL driver)

## Data Flow

### Success Path
1. **Order Creation**: Client → Order Service → OrderCreated Event
2. **Risk Assessment**: OrderCreated Event → Risk Service → RiskApproved Event
3. **Inventory Reservation**: RiskApproved Event → Inventory Service → InventoryReserved Event
4. **Payment Processing**: InventoryReserved Event → Payment Service → PaymentProcessed Event
5. **Order Completion**: PaymentProcessed Event → Order Service → OrderCompleted Event

### Failure Paths
1. **Risk Rejection**: Risk Service → RiskRejected Event → Order Service → OrderCancelled Event
2. **Inventory Insufficient**: Inventory Service → InventoryInsufficient Event → Order Service → OrderCancelled Event
3. **Payment Failure**: Payment Service → PaymentFailed Event → Order Service → OrderCancelled Event

### Compensating Actions
1. **Order Cancellation**: OrderCancelled Event → Inventory Service → InventoryReleased Event
2. **Refund Processing**: OrderCancelled Event → Payment Service → PaymentRefunded Event

## Scalability Considerations

### Horizontal Scaling
- Each service can be scaled independently
- Kafka partitions allow for parallel processing
- Database connections are pooled per service

### Performance Optimizations
- Event-driven architecture reduces coupling
- Asynchronous processing improves throughput
- Database indexes optimize query performance
- Connection pooling reduces database overhead

### Monitoring and Observability
- Structured JSON logging with correlation IDs
- Health check endpoints for each service
- Kafka UI for message monitoring
- Service-specific metrics and tracing

## Security Considerations

### Data Isolation
- Each service has its own database
- No direct database access between services
- Event-based communication only

### Input Validation
- Zod schemas validate all inputs
- Type safety with TypeScript
- SQL injection prevention with parameterized queries

### Network Security
- Services communicate within Docker network
- No external database exposure
- CORS configuration for API endpoints

## Deployment Architecture

### Development
- Docker Compose for local development
- Hot reloading with ts-node-dev
- Shared volume mounts for code changes

### Production Considerations
- Kubernetes deployment manifests
- ConfigMaps for environment variables
- Secrets for sensitive data
- Service mesh for communication
- Monitoring and alerting setup

## Error Handling Strategy

### Retry Logic
- Exponential backoff for transient failures
- Dead letter queues for failed messages
- Circuit breaker pattern for external calls

### Compensation
- Automatic compensating actions on failures
- Idempotent operations for safety
- Event sourcing for audit trails

### Monitoring
- Centralized logging with correlation IDs
- Health checks and readiness probes
- Metrics collection and alerting
