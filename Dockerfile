FROM ubuntu:latest

# Step 1: Build the application
FROM node:latest as build
LABEL authors="mccarl"

# Set the working directory in the container
WORKDIR /

# Copy package.json and package-lock.json
COPY package*.json /app/

# Install dependencies
RUN npm install

# Copy the source code
COPY . /app

# Build the app
RUN npm run build

# Step 2: Use a smaller base image to run the app
FROM nginx:alpine

# Copy static assets from builder stage
COPY --from=build build /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Containers run nginx with global directives and daemon off
ENTRYPOINT ["nginx", "-g", "daemon off;"]
