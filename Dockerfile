# Use a more recent Node.js image
FROM node:18

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy the entire project into the container, including the Prisma schema
COPY . .

# Generate Prisma Client (make sure schema.prisma is copied first)
RUN npx prisma generate

# Build the Next.js application
RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
