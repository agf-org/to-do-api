const asyncHandler = require('express-async-handler');
const {v4: uuidv4} = require('uuid');

const getItemIfExists = asyncHandler(async (request, response, next) => {
  const {itemId} = request.params;
  const item = response.locals.page.items.find(item => item.id === itemId);
  if (item) {
    response.locals.item = item;
    return next();
  } else {
    return response.status(404).send(`Item ${itemId} not found!`);
  }
});

/**
 * @swagger
 * 
 * /to-do/pages/{pageId}/items/{itemId}:
 *  get:
 *    tags:
 *      - items
 *    summary: Gets an item
 *    parameters:
 *      - name: pageId
 *        description: ID of the page
 *        in: path
 *        required: true
 *        schema:
 *          type: string
 *      - name: itemId
 *        description: ID of the item
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
 *              $ref: '#/definitions/Item'
 *      404:
 *        description: Not Found
 */
const getItem = asyncHandler(async (request, response) => {
  response.status(200).json(response.locals.item);
});

/**
 * @swagger
 * 
 * /to-do/pages/{pageId}/items/{itemId}:
 *  put:
 *    tags:
 *      - items
 *    summary: Updates an item
 *    parameters:
 *      - name: pageId
 *        description: ID of the page
 *        in: path
 *        required: true
 *        schema:
 *          type: string
 *      - name: itemId
 *        description: ID of the item
 *        in: path
 *        required: true
 *        schema:
 *          type: string
 *    requestBody:
 *        name: item
 *        description: Object representing the item
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/definitions/NewItem'
 *    responses:
 *      200:
 *        description: OK
 *      400:
 *        description: Bad Request
 *      404:
 *        description: Not Found
 */
const updateItem = asyncHandler(async (request, response) => {
  const itemIndex = response.locals.page.items.indexOf(response.locals.item);
  const {text, done} = request.body;
  response.locals.page.items.splice(itemIndex, 1);
  const newItem = {
    "id": request.params.itemId,
    "text": text,
    "done": done
  }
  response.locals.page.items.push(newItem)
  response.sendStatus(200);
});

/**
 * @swagger
 * 
 * /to-do/pages/{pageId}/items/{itemId}:
 *  delete:
 *    tags:
 *      - items
 *    summary: Deletes an item
 *    parameters:
 *      - name: pageId
 *        description: ID of the page
 *        in: path
 *        required: true
 *        schema:
 *          type: string
 *      - name: itemId
 *        description: ID of the item
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
const deleteItem = asyncHandler(async (request, response) => {
  const itemIndex = response.locals.page.items.indexOf(response.locals.item);
  response.locals.page.items.splice(itemIndex, 1);
  response.sendStatus(200);
});

/**
 * @swagger
 * 
 * /to-do/pages/{pageId}/items:
 *  get:
 *    tags:
 *      - items
 *    summary: Gets all items
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
 *              $ref: '#/definitions/Items'
 *      404:
 *        description: Not Found
 */
const getItems = asyncHandler(async (request, response) => {
  response.status(200).json(response.locals.page.items);
});

/**
 * @swagger
 * 
 * /to-do/pages/{pageId}/items:
 *  post:
 *    tags:
 *      - items
 *    summary: Adds an item
 *    parameters:
 *      - name: pageId
 *        description: ID of the page
 *        in: path
 *        required: true
 *        schema:
 *          type: string
 *    requestBody:
 *        name: item
 *        description: Object representing the item
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/definitions/NewItem'
 *    responses:
 *      201:
 *        description: Created
 *      400:
 *        description: Bad Request
 *      404:
 *        description: Not Found
 */
const addItem = asyncHandler(async (request, response) => {
  const {text, done} = request.body;
  const newItem = {
    "id": `${uuidv4()}`,
    "text": text,
    "done": done
  }
  response.locals.page.items.push(newItem)
  response.sendStatus(201);
});

module.exports.getItemIfExists = getItemIfExists;
module.exports.getItem = getItem;
module.exports.updateItem = updateItem;
module.exports.deleteItem = deleteItem;
module.exports.getItems = getItems;
module.exports.addItem = addItem;
