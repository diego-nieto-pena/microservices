#!/bin/bash

# Saga Pattern E-commerce Test Scenarios
# This script demonstrates various success and failure scenarios

echo "🚀 Starting Saga Pattern Test Scenarios"
echo "========================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Base URL for services
ORDER_SERVICE="http://localhost:3001"
RISK_SERVICE="http://localhost:3002"
INVENTORY_SERVICE="http://localhost:3003"
PAYMENT_SERVICE="http://localhost:3004"

# Function to check if service is healthy
check_service() {
    local service_name=$1
    local service_url=$2
    
    echo -n "Checking $service_name... "
    if curl -s "$service_url/health" > /dev/null; then
        echo -e "${GREEN}✓${NC}"
        return 0
    else
        echo -e "${RED}✗${NC}"
        return 1
    fi
}

# Function to wait for services
wait_for_services() {
    echo -e "\n${BLUE}Waiting for services to be ready...${NC}"
    
    local max_attempts=30
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        echo "Attempt $attempt/$max_attempts"
        
        if check_service "Order Service" "$ORDER_SERVICE/api/orders" && \
           check_service "Risk Service" "$RISK_SERVICE/api/risk" && \
           check_service "Inventory Service" "$INVENTORY_SERVICE/api/inventory" && \
           check_service "Payment Service" "$PAYMENT_SERVICE/api/payments"; then
            echo -e "${GREEN}All services are ready!${NC}\n"
            return 0
        fi
        
        echo "Waiting 5 seconds..."
        sleep 5
        attempt=$((attempt + 1))
    done
    
    echo -e "${RED}Services are not ready after $max_attempts attempts${NC}"
    exit 1
}

# Function to create an order and track its status
create_order() {
    local customer_id=$1
    local product_id=$2
    local quantity=$3
    local price=$4
    local scenario_name=$5
    
    echo -e "\n${YELLOW}Scenario: $scenario_name${NC}"
    echo "Creating order for customer: $customer_id"
    echo "Product: $product_id, Quantity: $quantity, Price: $price"
    
    local order_response=$(curl -s -X POST "$ORDER_SERVICE/api/orders" \
        -H "Content-Type: application/json" \
        -d "{
            \"customerId\": \"$customer_id\",
            \"items\": [
                {
                    \"productId\": \"$product_id\",
                    \"quantity\": $quantity,
                    \"price\": $price
                }
            ]
        }")
    
    local order_id=$(echo "$order_response" | jq -r '.data.id // empty')
    
    if [ -n "$order_id" ]; then
        echo -e "${GREEN}Order created: $order_id${NC}"
        
        # Wait a bit for saga processing
        echo "Waiting for saga processing..."
        sleep 3
        
        # Check final order status
        local order_status=$(curl -s "$ORDER_SERVICE/api/orders/$order_id" | jq -r '.data.status // "UNKNOWN"')
        echo "Final order status: $order_status"
        
        case $order_status in
            "COMPLETED")
                echo -e "${GREEN}✓ Saga completed successfully!${NC}"
                ;;
            "CANCELLED")
                echo -e "${YELLOW}⚠ Saga was cancelled (expected for failure scenarios)${NC}"
                ;;
            "FAILED")
                echo -e "${RED}✗ Saga failed${NC}"
                ;;
            *)
                echo -e "${YELLOW}? Saga status unknown: $order_status${NC}"
                ;;
        esac
    else
        echo -e "${RED}✗ Failed to create order${NC}"
        echo "Response: $order_response"
    fi
}

# Function to show inventory status
show_inventory() {
    echo -e "\n${BLUE}Current Inventory Status:${NC}"
    curl -s "$INVENTORY_SERVICE/api/inventory/products" | jq -r '.data[] | "\(.name): \(.availableQuantity) available, \(.reservedQuantity) reserved"'
}

# Function to show customer risk profiles
show_risk_profiles() {
    echo -e "\n${BLUE}Customer Risk Profiles:${NC}"
    for customer in customer-1 customer-2 customer-3 customer-4 customer-5; do
        local risk_profile=$(curl -s "$RISK_SERVICE/api/risk/profile/$customer" 2>/dev/null)
        if echo "$risk_profile" | jq -e '.data' > /dev/null 2>&1; then
            local credit_score=$(echo "$risk_profile" | jq -r '.data.creditScore')
            local max_amount=$(echo "$risk_profile" | jq -r '.data.maxOrderAmount')
            local risk_level=$(echo "$risk_profile" | jq -r '.data.riskLevel')
            echo "$customer: Credit Score $credit_score, Max Order: \$$max_amount, Risk: $risk_level"
        else
            echo "$customer: No risk profile found"
        fi
    done
}

# Main execution
main() {
    echo "Checking if jq is installed..."
    if ! command -v jq &> /dev/null; then
        echo -e "${RED}Error: jq is not installed. Please install jq to run this script.${NC}"
        echo "On macOS: brew install jq"
        echo "On Ubuntu: sudo apt-get install jq"
        exit 1
    fi
    
    wait_for_services
    
    echo -e "${BLUE}Initial System State:${NC}"
    show_inventory
    show_risk_profiles
    
    echo -e "\n${BLUE}Running Test Scenarios...${NC}"
    
    # Scenario 1: Successful order (low-risk customer, small amount)
    create_order "customer-1" "product-1" 1 29.99 "Successful Order - Low Risk Customer"
    
    # Scenario 2: Risk rejection (high-risk customer, large amount)
    create_order "customer-3" "product-1" 1 600.00 "Risk Rejection - High Risk Customer"
    
    # Scenario 3: Inventory insufficient (large quantity)
    create_order "customer-1" "product-1" 1000 29990.00 "Inventory Insufficient - Large Quantity"
    
    # Scenario 4: Another successful order
    create_order "customer-2" "product-2" 2 59.98 "Another Successful Order - Medium Risk Customer"
    
    # Scenario 5: Payment failure (will happen randomly due to 10% failure rate)
    create_order "customer-4" "product-3" 1 149.99 "Potential Payment Failure - Random"
    
    echo -e "\n${BLUE}Final System State:${NC}"
    show_inventory
    
    echo -e "\n${GREEN}Test scenarios completed!${NC}"
    echo -e "\n${YELLOW}Note: Check the service logs to see the saga pattern in action:${NC}"
    echo "docker-compose logs -f order-service"
    echo "docker-compose logs -f risk-service"
    echo "docker-compose logs -f inventory-service"
    echo "docker-compose logs -f payment-service"
}

# Run main function
main "$@"
