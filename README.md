# To-do API

## Usage

Create a `.env` file inside the project directory with the following environment variables:

* NODE_ENV=development
* MONGODB_HOST=127.0.0.1
* MONGODB_PORT=27017
* MONGODB_DATABASE=notebook
* TO_DO_API_TAG=development
* TO_DO_API_PORT=3000
* DEBUG=to-do-api:*

To start the app use:
```
$ docker-compose up -d
```

## Documentation

API specification can be found at http://localhost:3000/api/api-docs/
