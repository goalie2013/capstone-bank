FROM node:16-alpine

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

FROM node:16-alpine

# Add working directory
WORKDIR /usr/src/app
# Copy npm dependencies (Host -> Docker)
COPY package*.json ./

# Install dependencies
RUN npm install -production --silent && mv node_modules ../

# Copy local files to app source code
COPY . .

#Expose port and start the application
EXPOSE 5050

# CMD is Entry Point of application
CMD ["npm", "start"]