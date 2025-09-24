# Multi-stage build for all services
FROM node:18-alpine AS shared-builder

WORKDIR /app
COPY shared/ ./shared/
WORKDIR /app/shared
RUN npm install
RUN npm run build
RUN npm pack --pack-destination /app/shared

FROM node:18-alpine AS order-service
WORKDIR /app
RUN apk add --no-cache curl

# Bring packed shared tarball
COPY --from=shared-builder /app/shared/*.tgz /shared/shared.tgz

# Copy service files
COPY services/order-service/package*.json ./
# Remove local file dep to avoid npm bug inside containers, then install
RUN npm pkg delete dependencies['@saga-pattern/shared'] || true \
  && npm install \
  && npm install /shared/shared.tgz

COPY services/order-service/src ./src
COPY services/order-service/tsconfig.json ./
RUN npm run build
COPY services/order-service/src/database/migrations ./dist/database/migrations

EXPOSE 3000
CMD ["npm", "start"]

FROM node:18-alpine AS risk-service
WORKDIR /app
RUN apk add --no-cache curl

# Bring packed shared tarball
COPY --from=shared-builder /app/shared/*.tgz /shared/shared.tgz

# Copy service files
COPY services/risk-service/package*.json ./
RUN npm pkg delete dependencies['@saga-pattern/shared'] || true \
  && npm install \
  && npm install /shared/shared.tgz

COPY services/risk-service/src ./src
COPY services/risk-service/tsconfig.json ./
RUN npm run build
COPY services/risk-service/src/database/migrations ./dist/database/migrations

EXPOSE 3000
CMD ["npm", "start"]

FROM node:18-alpine AS inventory-service
WORKDIR /app
RUN apk add --no-cache curl

# Bring packed shared tarball
COPY --from=shared-builder /app/shared/*.tgz /shared/shared.tgz

# Copy service files
COPY services/inventory-service/package*.json ./
RUN npm pkg delete dependencies['@saga-pattern/shared'] || true \
  && npm install \
  && npm install /shared/shared.tgz

COPY services/inventory-service/src ./src
COPY services/inventory-service/tsconfig.json ./
RUN npm run build
COPY services/inventory-service/src/database/migrations ./dist/database/migrations

EXPOSE 3000
CMD ["npm", "start"]

FROM node:18-alpine AS payment-service
WORKDIR /app
RUN apk add --no-cache curl

# Bring packed shared tarball
COPY --from=shared-builder /app/shared/*.tgz /shared/shared.tgz

# Copy service files
COPY services/payment-service/package*.json ./
RUN npm pkg delete dependencies['@saga-pattern/shared'] || true \
  && npm install \
  && npm install /shared/shared.tgz

COPY services/payment-service/src ./src
COPY services/payment-service/tsconfig.json ./
RUN npm run build
COPY services/payment-service/src/database/migrations ./dist/database/migrations

EXPOSE 3000
CMD ["npm", "start"]
