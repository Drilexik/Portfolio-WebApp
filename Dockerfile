# ─────────────────────────────────────────────────────────────────────────────
# Stage 1 — deps
# Install production + dev dependencies into a clean layer.
# ─────────────────────────────────────────────────────────────────────────────
FROM node:22-alpine AS deps

WORKDIR /app

COPY package.json package-lock.json* ./

# Install all deps (including devDeps needed for build)
RUN npm ci


# ─────────────────────────────────────────────────────────────────────────────
# Stage 2 — builder
# Build the Next.js application in standalone output mode.
# ─────────────────────────────────────────────────────────────────────────────
FROM node:22-alpine AS builder

WORKDIR /app

# Copy installed deps from previous stage
COPY --from=deps /app/node_modules ./node_modules

# Copy source code
COPY . .

# Build — disable Next.js telemetry in CI/CD environments
ENV NEXT_TELEMETRY_DISABLED=1

# next build reads DATABASE_URL / POSTGRES_* at build time only for type-checking;
# actual DB connections happen at runtime. Set dummy values so the build succeeds.
ENV POSTGRES_HOST=localhost \
    POSTGRES_PORT=5432 \
    POSTGRES_DB=drilex \
    POSTGRES_USER=drilex \
    POSTGRES_PASSWORD=build_placeholder \
    ADMIN_PASSWORD=build_placeholder

RUN npm run build


# ─────────────────────────────────────────────────────────────────────────────
# Stage 3 — runner
# Minimal production image using Next.js standalone output.
# ─────────────────────────────────────────────────────────────────────────────
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create a non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser  --system --uid 1001 nextjs

# Copy the standalone build output
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static     ./.next/static
COPY --from=builder /app/public           ./public

# Ensure the uploads directory exists with correct permissions
RUN mkdir -p ./public/uploads && chown -R nextjs:nodejs ./public/uploads

# Switch to non-root
USER nextjs

# PORT is read at runtime from the .env / docker-compose environment.
# Default to 5000 so the container is self-documenting.
ENV PORT=5000
EXPOSE ${PORT}

# Next.js standalone entry point
CMD ["sh", "-c", "node server.js"]
