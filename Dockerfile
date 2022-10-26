FROM node:19-alpine

# Add working directory
WORKDIR /server
# Copy npm dependencies (Host -> Docker)
COPY package.json /server/package.json

# Install dependencies
RUN npm install
# Copy app source code
COPY . /server

#Expose port and start the application
# CMD is Entry Point of application
EXPOSE 5050

FROM node:19-alpine

# Add working directory
WORKDIR /client
# Copy npm dependencies (Host -> Docker)
COPY package.json /client/package.json

# Install dependencies
RUN npm install
# Copy app source code
COPY . /client

#Expose port and start the application
# CMD is Entry Point of application
EXPOSE 3000

CMD ["npm", "run", "dev"]