# Dockerfile

# set node version. 18-alpine is a lightweight version of node
FROM node:18-alpine
#set working directory in the container
WORKDIR /app
# copy all files from the current directory to the working directory in the container
# this includes package.json and package-lock.json
COPY . .
RUN npm install
RUN npm run build

# combined with .dockerignore file