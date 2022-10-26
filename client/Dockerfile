FROM node:19-alpine

# Add working directory
WORKDIR /usr/src/app

# Copy npm dependencies (Host -> Docker)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy local files to app folder
COPY . .

# Expose port
EXPOSE 3000

# CMD is Entry Point of application
CMD ["npm", "start"]