FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
ENV BUILDING=true
ENV POSTGRES_HOST=localhost POSTGRES_PORT=5432 POSTGRES_DB=drilex
ENV POSTGRES_USER=drilex POSTGRES_PASSWORD=build_placeholder ADMIN_PASSWORD=build_placeholder
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs && \
    adduser  --system --uid 1001 nextjs

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static     ./.next/static
COPY --from=builder /app/public           ./public

RUN mkdir -p ./public/uploads && chown -R nextjs:nodejs ./public/uploads && \
    chown -R nextjs:nodejs /app

USER nextjs

ENV PORT=5000
EXPOSE ${PORT}

CMD ["node", "server.js"]
