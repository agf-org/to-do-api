const asyncHandler = require('express-async-handler');
const {v4: uuidv4} = require('uuid');

const {notebook} = require('../models/notebook');

const getPageIfExists = asyncHandler(async (request, response, next) => {
  const pageId = request.params.pageId;
  const page = notebook.pages.find(page => page.id === pageId);
  if (page) {
    response.locals.page = page;
    return next();
  } else {
    return response.status(404).send(`Page ${pageId} not found!`);
  }
});

/**
 * @swagger
 * 
 * /to-do/pages:
 *  get:
 *    tags:
 *      - Pages
 *    summary: Gets all pages
 *    responses:
 *      200:
 *        description: OK
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/definitions/Pages'
 */
const getPages = asyncHandler(async (request, response) => {
  response.status(200).json(notebook.pages);
});

/**
 * @swagger
 * 
 * /to-do/pages:
 *  post:
 *    tags:
 *      - Pages
 *    summary: Adds a page
 *    responses:
 *      201:
 *        description: Created
 */
const addPage = asyncHandler(async (request, response) => {
  const newPage = {
    "id": uuidv4(),
    "items": []
  }
  notebook.pages.push(newPage)
  response.sendStatus(201);
});

module.exports.getPageIfExists = getPageIfExists;
module.exports.getPages = getPages;
module.exports.addPage = addPage;
