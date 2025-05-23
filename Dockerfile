# Use official Node.js image as base image
FROM node:20-slim

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build project
RUN npm run build

# Set start command
CMD ["node", "build/index.js"] 