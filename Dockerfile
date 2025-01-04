FROM oven/bun:slim AS build

WORKDIR /app

ENV NODE_ENV=production

# Install packages
COPY bun.lockb package.json ./
RUN bun install

# Build application
COPY . .
RUN bun run build

# Copy over application
FROM node:latest

WORKDIR /app

COPY --from=build /app/build build
COPY --from=build /app/node_modules node_modules
COPY --from=build /app/migrations migrations
COPY --from=build /app/drizzle.config.ts drizzle.config.ts

# Start the server
ENV NODE_ENV=production
ENV BODY_SIZE_LIMIT=100M

EXPOSE 3000
CMD ["node", "build/index.js"]
