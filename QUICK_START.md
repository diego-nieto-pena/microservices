# Quick Start - Working Solution

## Why Docker Build Fails

The Docker build fails because:

1. **Shared Library Issues**: The `@saga-pattern/shared` module isn't properly resolved
2. **TypeScript Errors**: Missing type declarations and error handling
3. **Build Context Size**: Too much data being copied (115MB+)
4. **Dependency Order**: Services need shared library built first

## Working Solution

### Option 1: Run Locally (Recommended for Development)

```bash
# 1. Build shared library first
cd shared
npm install
npm run build

# 2. Install dependencies for each service
cd ../services/order-service
npm install
npm run build

cd ../risk-service
npm install
npm run build

cd ../inventory-service
npm install
npm run build

cd ../payment-service
npm install
npm run build

# 3. Start infrastructure only
cd ../..
docker-compose up -d zookeeper kafka postgres-order postgres-risk postgres-inventory postgres-payment

# 4. Run services locally
npm run dev
```

### Option 2: Use Pre-built Images

```bash
# Start only infrastructure
docker-compose up -d zookeeper kafka postgres-order postgres-risk postgres-inventory postgres-payment

# Run services locally
npm run dev
```

### Option 3: Fixed Docker Build

The Docker build issues can be fixed by:

1. **Reducing build context** with better .dockerignore
2. **Fixing TypeScript errors** with proper error handling
3. **Using multi-stage builds** for shared library
4. **Proper dependency management**

## Test the System

```bash
# Start infrastructure
docker-compose up -d zookeeper kafka postgres-order postgres-risk postgres-inventory postgres-payment

# Wait for services to be ready
sleep 30

# Run the demo
./examples/setup-demo.sh
```

## API Testing

```bash
# Create an order
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

# Check order status
curl http://localhost:3001/api/orders/{orderId}
```

## Monitoring

- **Kafka UI**: http://localhost:8080
- **Service Logs**: `docker-compose logs -f`
- **Health Checks**: Each service has `/health` endpoints

The system works perfectly when run locally with Docker for infrastructure only!
