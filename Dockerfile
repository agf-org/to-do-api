FROM node:14
LABEL org.opencontainers.image.source https://github.com/to-do-app/api

WORKDIR /api

COPY package*.json ./
RUN npm ci

COPY . .

EXPOSE 3000

ENTRYPOINT  ["npm"]
CMD ["start"]
