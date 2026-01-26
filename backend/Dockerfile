# Build stage
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install -g npm@latest && npm install

COPY . .
RUN npm run build

# Production stage
FROM node:22-alpine

WORKDIR /app

ENV NODE_ENV production

# Update npm to fix vulnerabilities in the runner stage
RUN npm install -g npm@latest

COPY package*.json ./
RUN npm install --only=production && npm cache clean --force

COPY --from=builder /app/dist ./dist

EXPOSE 5000

CMD ["node", "dist/index.js"]
