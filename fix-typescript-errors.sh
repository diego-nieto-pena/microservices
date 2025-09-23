#!/bin/bash

# Fix TypeScript errors across all services
echo "Fixing TypeScript errors..."

# Function to fix error handling in a file
fix_error_handling() {
    local file=$1
    if [ -f "$file" ]; then
        echo "Fixing $file"
        # Replace error.message with proper error handling
        sed -i '' 's/error\.message/error instanceof Error ? error.message : String(error)/g' "$file"
        # Fix any remaining error references
        sed -i '' 's/error: error\.message/error: error instanceof Error ? error.message : String(error)/g' "$file"
    fi
}

# Fix all service files
for service in order-service risk-service inventory-service payment-service; do
    echo "Fixing $service..."
    
    # Fix controllers
    find "services/$service/src/controllers" -name "*.ts" -exec bash -c 'fix_error_handling "$0"' {} \;
    
    # Fix services
    find "services/$service/src/services" -name "*.ts" -exec bash -c 'fix_error_handling "$0"' {} \;
    
    # Fix routes
    find "services/$service/src/routes" -name "*.ts" -exec bash -c 'fix_error_handling "$0"' {} \;
    
    # Fix main index files
    fix_error_handling "services/$service/src/index.ts"
    
    # Fix models
    find "services/$service/src/models" -name "*.ts" -exec bash -c 'fix_error_handling "$0"' {} \;
done

echo "TypeScript errors fixed!"
