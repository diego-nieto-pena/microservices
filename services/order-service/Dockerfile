FROM node:18-alpine

WORKDIR /app

# Install curl for health checks
RUN apk add --no-cache curl

# Copy shared library first
COPY shared/ ./shared/

# Install shared library dependencies and build
WORKDIR /app/shared
RUN npm install
RUN npm run build

# Copy service package files
WORKDIR /app
COPY services/order-service/package*.json ./

# Install service dependencies
RUN rm -f package-lock.json && \
    npm pkg delete dependencies['@saga-pattern/shared'] || true && \
    npm install

# Copy the built shared library to node_modules
RUN mkdir -p ./node_modules/@saga-pattern/shared && \
    cp -r ./shared/dist ./node_modules/@saga-pattern/shared && \
    cp ./shared/package.json ./node_modules/@saga-pattern/shared/package.json

# Copy service source code
COPY services/order-service/src ./src
COPY services/order-service/tsconfig.json ./

# Build the application
RUN npm run build

# Copy non-TS assets to the dist folder
COPY services/order-service/src/database/migrations ./dist/database/migrations/

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

# Start the application
CMD ["npm", "start"]
