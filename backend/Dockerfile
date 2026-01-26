# Build stage
FROM node:22 AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install -g npm@latest && npm install

COPY . .
RUN npm run build

# Production stage
FROM node:22

WORKDIR /app

COPY package*.json ./
RUN npm install --only=production

COPY --from=builder /app/dist ./dist

EXPOSE 5000

CMD ["npm", "start"]
