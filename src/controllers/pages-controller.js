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
 * /to-do/pages/{pageId}:
 *  get:
 *    tags:
 *      - Pages
 *    summary: Gets a page
 *    parameters:
 *      - name: pageId
 *        description: ID of the page
 *        in: path
 *        required: true
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: OK
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/definitions/Page'
 *      404:
 *        description: Not Found
 */
const getPage = asyncHandler(async (request, response) => {
  response.status(200).json(response.locals.page);
});

/**
 * @swagger
 * 
 * /to-do/pages/{pageId}:
 *  delete:
 *    tags:
 *      - Pages
 *    summary: Deletes a page
 *    parameters:
 *      - name: pageId
 *        description: ID of the page
 *        in: path
 *        required: true
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: OK
 *      404:
 *        description: Not Found
 */
const deletePage = asyncHandler(async (request, response) => {
  const pageIndex = notebook.pages.indexOf(response.locals.page);
  notebook.pages.splice(pageIndex, 1);
  response.sendStatus(200);
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
module.exports.getPage = getPage;
module.exports.deletePage = deletePage;
module.exports.getPages = getPages;
module.exports.addPage = addPage;
