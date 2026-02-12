# Stage 1: Builder
FROM node:20-alpine AS builder

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /usr/src/app

# Copy package.json and pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --no-frozen-lockfile

# Copy source code
COPY . .

# Build the application
RUN pnpm run build

# Stage 2: Production
FROM node:20-alpine AS production

WORKDIR /usr/src/app

# Production stage
FROM node:20-alpine

# Import public key for pnpm if needed, but for simple run we might just rely on node
# However, we need to ensure the runtime has what it needs.
# Copying node_modules from builder is good.

COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist ./dist

# Expose WebSocket port
EXPOSE 3001

# Start the application
CMD ["node", "dist/main"]