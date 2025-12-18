# Use the official Node.js 18 image as the base image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (if available) to the working directory
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy the rest of the application code to the working directory
COPY . .

# Create logs directory
RUN mkdir -p logs

# Generate Prisma client
RUN npx prisma generate

# Expose port 8000 to allow communication to/from the textbook generation service
EXPOSE 8000

# Run the application
CMD ["npm", "start"]