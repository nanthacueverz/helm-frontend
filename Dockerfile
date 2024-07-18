# Use the official Node.js image as the base image
FROM node:16

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies with legacy peer dependencies resolution
RUN npm install --legacy-peer-deps

# Copy the rest of the application code to the working directory
COPY . .

# Build the React application including Tailwind CSS
RUN npm run build

# Install a lightweight web server to serve the built application
RUN npm install -g serve

# Set the command to run the web server
CMD ["serve", "-s", "build"]

# Expose the port the application will run on
EXPOSE 3000