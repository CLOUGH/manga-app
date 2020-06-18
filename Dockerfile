# common base image for development and
FROM node:10.15.3
WORKDIR /app

ARG SC_NPM_TOKEN
ENV SC_NPM_TOKEN="${SC_NPM_TOKEN}"

# dev image contains everything needed for testing, development and building
FROM base AS development
COPY . /app

# install all dependencies and add source code
RUN npm install
RUN npm install -g @angular/cli@9.1.8

# builder runs unit tests and linter, then builds production code
FROM development as builder
RUN npm run build:ssr --prod --output-path=dist
# RUN ls -ls ../
# RUN ls -ls .
# RUN pwd

# release includes bare minimum required to run the app, copied from builder
FROM base AS release
COPY --from=builder /app/dist /app/dist
COPY --from=builder /app/package.json /app/

ENV NODE_ENV "production"
ENV PORT 3000

EXPOSE 3000
CMD ["npm", "run ", "serve:ssr"]
