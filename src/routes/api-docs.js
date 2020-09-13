const router = require('express').Router();
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');
const {version} = require('../../package');

const options = {
  explorer: true,
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'To-do API',
      version: version,
      description: 'Welcome to my To-do API!'
    },
    servers: [
        {
            url: `/api`
        }
    ]
  },
  apis: [
      'src/controllers/itemController.js'
    ],
};

const swaggerSpec = swaggerJSDoc(options);

const serveSwaggerSpec = (request, response) => {
    response.setHeader('Content-Type', 'application/json');
    response.send(swaggerSpec);
};

router.use('/', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

router.route('/')
  .get(serveSwaggerSpec);

module.exports = router;
