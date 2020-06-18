# common base image for development and
FROM node:12-alpine as buildContainer
WORKDIR /app

# dev image contains everything needed for testing, development and building
COPY ./package.json ./package-lock.json /app/
RUN npm install
COPY . /app
RUN npm run build:ssr


FROM node:8-alpine

WORKDIR /app
# Copy dependency definitions
COPY --from=buildContainer /app/package.json /app
# COPY --from=buildContainer /app/server.js /app

# Get all the code needed to run the app
COPY --from=buildContainer /app/dist /app/dist
# COPY --from=buildContainer /app/static /app/static
COPY --from=buildContainer /app/dist-server /app/dist-server

# Expose the port the app runs in
EXPOSE 8080
