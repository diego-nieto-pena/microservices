#!/bin/bash

# Setup Demo Script for Saga Pattern E-commerce Example
# This script sets up the complete environment and runs a demonstration

echo "🎯 Saga Pattern E-commerce Demo Setup"
echo "====================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to check if Docker is running
check_docker() {
    echo -n "Checking Docker... "
    if docker info > /dev/null 2>&1; then
        echo -e "${GREEN}✓${NC}"
        return 0
    else
        echo -e "${RED}✗${NC}"
        echo "Please start Docker Desktop and try again."
        exit 1
    fi
}

# Function to check if required tools are installed
check_dependencies() {
    echo -n "Checking dependencies... "
    
    local missing_deps=()
    
    if ! command -v docker &> /dev/null; then
        missing_deps+=("docker")
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        missing_deps+=("docker-compose")
    fi
    
    if ! command -v jq &> /dev/null; then
        missing_deps+=("jq")
    fi
    
    if [ ${#missing_deps[@]} -eq 0 ]; then
        echo -e "${GREEN}✓${NC}"
        return 0
    else
        echo -e "${RED}✗${NC}"
        echo "Missing dependencies: ${missing_deps[*]}"
        echo ""
        echo "Install instructions:"
        echo "- Docker: https://docs.docker.com/get-docker/"
        echo "- Docker Compose: https://docs.docker.com/compose/install/"
        echo "- jq: brew install jq (macOS) or sudo apt-get install jq (Ubuntu)"
        exit 1
    fi
}

# Function to clean up existing containers
cleanup() {
    echo -e "\n${YELLOW}Cleaning up existing containers...${NC}"
    docker-compose down -v 2>/dev/null || true
    docker system prune -f > /dev/null 2>&1
}

# Function to start infrastructure
start_infrastructure() {
    echo -e "\n${BLUE}Starting infrastructure services...${NC}"
    
    # Start databases and Kafka
    docker-compose up -d zookeeper kafka postgres-order postgres-risk postgres-inventory postgres-payment
    
    echo "Waiting for infrastructure to be ready..."
    sleep 30
    
    # Check if services are running
    local services=("zookeeper" "kafka" "postgres-order" "postgres-risk" "postgres-inventory" "postgres-payment")
    for service in "${services[@]}"; do
        if docker-compose ps | grep -q "$service.*Up"; then
            echo -e "${GREEN}✓ $service is running${NC}"
        else
            echo -e "${RED}✗ $service failed to start${NC}"
            echo "Check logs: docker-compose logs $service"
            exit 1
        fi
    done
}

# Function to build and start microservices
start_microservices() {
    echo -e "\n${BLUE}Building and starting microservices...${NC}"
    
    # Install dependencies and build shared library
    echo "Installing dependencies..."
    npm install
    cd shared && npm install && npm run build && cd ..
    
    # Start microservices
    echo "Starting microservices..."
    docker-compose up -d order-service risk-service inventory-service payment-service
    
    echo "Waiting for microservices to be ready..."
    sleep 45
    
    # Check if services are healthy
    local services=("order-service" "risk-service" "inventory-service" "payment-service")
    for service in "${services[@]}"; do
        if docker-compose ps | grep -q "$service.*Up"; then
            echo -e "${GREEN}✓ $service is running${NC}"
        else
            echo -e "${RED}✗ $service failed to start${NC}"
            echo "Check logs: docker-compose logs $service"
        fi
    done
}

# Function to verify setup
verify_setup() {
    echo -e "\n${BLUE}Verifying setup...${NC}"
    
    local max_attempts=10
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        echo "Health check attempt $attempt/$max_attempts"
        
        local all_healthy=true
        
        # Check each service
        if ! curl -s http://localhost:3001/api/orders/health > /dev/null; then
            all_healthy=false
        fi
        
        if ! curl -s http://localhost:3002/api/risk/health > /dev/null; then
            all_healthy=false
        fi
        
        if ! curl -s http://localhost:3003/api/inventory/health > /dev/null; then
            all_healthy=false
        fi
        
        if ! curl -s http://localhost:3004/api/payments/health > /dev/null; then
            all_healthy=false
        fi
        
        if [ "$all_healthy" = true ]; then
            echo -e "${GREEN}✓ All services are healthy!${NC}"
            return 0
        fi
        
        echo "Waiting 10 seconds..."
        sleep 10
        attempt=$((attempt + 1))
    done
    
    echo -e "${RED}✗ Services are not healthy after $max_attempts attempts${NC}"
    echo "Check logs: docker-compose logs"
    return 1
}

# Function to show demo information
show_demo_info() {
    echo -e "\n${GREEN}🎉 Demo Setup Complete!${NC}"
    echo ""
    echo -e "${BLUE}Service URLs:${NC}"
    echo "• Order Service:    http://localhost:3001"
    echo "• Risk Service:     http://localhost:3002"
    echo "• Inventory Service: http://localhost:3003"
    echo "• Payment Service:  http://localhost:3004"
    echo "• Kafka UI:         http://localhost:8080"
    echo ""
    echo -e "${BLUE}Next Steps:${NC}"
    echo "1. Run test scenarios: ./examples/test-scenarios.sh"
    echo "2. Monitor logs: docker-compose logs -f"
    echo "3. Check Kafka UI: open http://localhost:8080"
    echo ""
    echo -e "${BLUE}Example API Calls:${NC}"
    echo "# Create an order"
    echo "curl -X POST http://localhost:3001/api/orders \\"
    echo "  -H 'Content-Type: application/json' \\"
    echo "  -d '{\"customerId\": \"customer-1\", \"items\": [{\"productId\": \"product-1\", \"quantity\": 1, \"price\": 29.99}]}'"
    echo ""
    echo "# Check order status"
    echo "curl http://localhost:3001/api/orders/{orderId}"
    echo ""
    echo -e "${YELLOW}Press Ctrl+C to stop all services${NC}"
}

# Function to run demo
run_demo() {
    echo -e "\n${BLUE}Running demo scenarios...${NC}"
    
    if [ -f "./examples/test-scenarios.sh" ]; then
        ./examples/test-scenarios.sh
    else
        echo -e "${YELLOW}Test scenarios script not found. Running basic test...${NC}"
        
        # Basic test
        echo "Creating a test order..."
        local order_response=$(curl -s -X POST http://localhost:3001/api/orders \
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
            }')
        
        echo "Order response: $order_response"
    fi
}

# Main execution
main() {
    echo "Starting demo setup..."
    
    check_docker
    check_dependencies
    cleanup
    start_infrastructure
    start_microservices
    
    if verify_setup; then
        show_demo_info
        
        # Ask if user wants to run demo
        echo ""
        read -p "Do you want to run the demo scenarios now? (y/n): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            run_demo
        fi
        
        # Keep services running
        echo -e "\n${YELLOW}Services are running. Press Ctrl+C to stop.${NC}"
        docker-compose logs -f
    else
        echo -e "${RED}Setup failed. Please check the logs and try again.${NC}"
        exit 1
    fi
}

# Handle Ctrl+C
trap 'echo -e "\n${YELLOW}Stopping services...${NC}"; docker-compose down; exit 0' INT

# Run main function
main "$@"
