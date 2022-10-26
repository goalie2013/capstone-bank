FROM node:12

ENV PORT 3000

# Add working directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Copy npm dependencies (Host -> Docker)
COPY package*.json /usr/src/app

# Install dependencies
RUN npm install

# Copy local files to app folder
COPY . /usr/src/app

RUN npm run build
# Expose port
EXPOSE 3000

CMD ["npm", "run", "dev"]
