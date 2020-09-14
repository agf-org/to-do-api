const asyncHandler = require('express-async-handler');
const {v4: uuidv4} = require('uuid');

const {notebook} = require('../models/notebook');

/**
 * @swagger
 *
 * definitions:
 *   Items:
 *     type: array
 *     items:
 *       $ref: '#/definitions/Item'
 *   NewItem:
 *     type: object
 *     required:
 *       - text
 *       - done
 *     properties:
 *       text:
 *         type: string
 *       done:
 *         type: boolean
 *   Item:
 *     type: object
 *     required:
 *       - id
 *       - text
 *       - done
 *     properties:
 *       id:
 *         type: integer
 *       text:
 *         type: string
 *       done:
 *         type: boolean
 */

/**
 * @swagger
 * 
 * /to-do/items:
 *  get:
 *    tags:
 *      - items
 *    summary: Returns all items
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
  response.status(200).json(notebook.pages[0].items);
});

/**
 * @swagger
 * 
 * /to-do/items:
 *  post:
 *    tags:
 *      - items
 *    summary: Adds an item
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
 */
const addItem = asyncHandler(async (request, response) => {
  const {text, done} = request.body;
  if (text != undefined && done != undefined) {
    const newItem = {
      "id": `${uuidv4()}`,
      "text": text,
      "done": done
    }
    notebook.pages[0].items.push(newItem)
    response.sendStatus(201);
  } else {
    response.sendStatus(400);
  }
});


/**
 * @swagger
 * 
 * /to-do/items/{id}:
 *  get:
 *    tags:
 *      - items
 *    summary: Returns an item
 *    parameters:
 *      - name: id
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
  const id = request.params.id;
  const item = notebook.pages[0].items.find(item => item.id == id);
  if (item) {
    response.status(200).json(item);
  } else {
    response.sendStatus(404);
  }
});

/**
 * @swagger
 * 
 * /to-do/items/{id}:
 *  put:
 *    tags:
 *      - items
 *    summary: Updates an item
 *    parameters:
 *      - name: id
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
  const id = request.params.id;
  const items = notebook.pages[0].items;
  const itemIndex = items.findIndex(item => item.id == id);
  if (itemIndex != -1) {
    const {text, done} = request.body;
    if (text != undefined && done != undefined) {
      items.splice(itemIndex, 1);
      const newItem = {
        "id": id,
        "text": text,
        "done": done
      }
      items.push(newItem)
      response.sendStatus(200);
    } else {
      response.sendStatus(400);
    }
  } else {
    response.sendStatus(404);
  }
});

/**
 * @swagger
 * 
 * /to-do/items/{id}:
 *  delete:
 *    tags:
 *      - items
 *    summary: Deletes an item
 *    parameters:
 *      - name: id
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
  const id = request.params.id;
  const items = notebook.pages[0].items;
  const itemIndex = items.findIndex(item => item.id == id);
  if (itemIndex != -1) {
    items.splice(itemIndex, 1);
    response.sendStatus(200);
  } else {
    response.sendStatus(404);
  }
});

module.exports.getItems = getItems;
module.exports.getItem = getItem;
module.exports.addItem = addItem;
module.exports.updateItem = updateItem;
module.exports.deleteItem = deleteItem;
