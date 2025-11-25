FROM node:22-alpine

# Create working directory
WORKDIR /app

# Copy package files first (better caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build NestJS (creates dist/)
RUN npm run build

# Expose API port
EXPOSE 3000

# Start production server
CMD ["npm", "run", "start:prod"]
