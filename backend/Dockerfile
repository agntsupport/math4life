FROM node:18-alpine AS development

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 80

CMD ["npm", "run", "dev"]

FROM node:18-alpine AS builder

# Install build dependencies
RUN apk add --no-cache python3 make g++

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ALL dependencies (including devDependencies for TypeScript)
RUN npm install

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

FROM node:18-alpine AS production

# Install runtime dependencies
RUN apk add --no-cache curl

WORKDIR /app

# Copy package files and install only production dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD curl -f http://localhost/api/health || exit 1

EXPOSE 80

ENV PORT=80

CMD ["node", "dist/index.js"]