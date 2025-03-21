FROM node:18-alpine AS builder

# Create app directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Generate Prisma client and build
RUN npx prisma generate
RUN npm run build || echo "No build script found, using ts-node in production"

# Production image
FROM node:18-alpine AS production

# Set environment variables
ENV NODE_ENV=production

# Create app directory
WORKDIR /app

# Copy Prisma schema first - this needs to be before npm ci
COPY --from=builder /app/prisma /app/prisma
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production

# Copy build artifacts from builder
COPY --from=builder /app/node_modules/.prisma /app/node_modules/.prisma
COPY --from=builder /app/dist /app/dist

# Copy other necessary files
COPY --from=builder /app/package.json /app/package.json
COPY --from=builder /app/package-lock.json /app/package-lock.json
COPY --from=builder /app/.env.example /app/.env.example

# Create non-root user for security
RUN addgroup -S appuser && adduser -S appuser -G appuser
USER appuser

# Create volume for logs and data
VOLUME ["/app/logs", "/app/data"]

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:5000/health || exit 1

# Run app with correct path to index.js
CMD ["node", "dist/src/index.js"]