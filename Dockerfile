FROM node:14

WORKDIR /api

COPY package*.json ./
RUN npm ci

COPY . .

EXPOSE 3000

ENTRYPOINT  ["npm"]
CMD ["start"]
