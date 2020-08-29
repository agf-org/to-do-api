const router = require('express').Router();
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'To-do API',
      version: '1.0.0',
      description: 'Welcome to my To-do API!'
    },
  },
  apis: [
      'routes/index.js',
      'routes/items.js'
    ],
};

const swaggerSpec = swaggerJSDoc(options);

const serveSwaggerSpec = (request, response) => {
    response.setHeader('Content-Type', 'application/json');
    response.send(swaggerSpec);
};

router.use(`/`, swaggerUi.serve, swaggerUi.setup(swaggerSpec));
router.route('/').get(serveSwaggerSpec);

module.exports = router;
