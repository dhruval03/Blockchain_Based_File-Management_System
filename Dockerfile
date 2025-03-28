FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the project files
COPY . .

# Expose the port (if needed)
EXPOSE 3000

# Start the frontend server
CMD ["npm", "start"]
