FROM node:14

WORKDIR /to-do-api

COPY package*.json ./
RUN npm ci

COPY . .

EXPOSE 3000

ENTRYPOINT  ["npm"]
CMD ["start"]
