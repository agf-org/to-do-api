FROM node:14

COPY . to-do-api
WORKDIR /to-do-api
RUN npm install

EXPOSE 3000

ENTRYPOINT  ["npm"]
CMD [ "start"]
