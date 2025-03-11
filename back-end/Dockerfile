# Use official Node.js image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the application
COPY . .

# Set the working directory to src
WORKDIR /app/src

# Expose the port
EXPOSE 5000

# Start the backend server
CMD ["node", "server.js"]
