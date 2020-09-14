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
 * /to-do/pages/{pageId}/items:
 *  get:
 *    tags:
 *      - items
 *    summary: Returns all items
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
  const pageId = request.params.pageId;
  const page = notebook.pages.find(page => page.id === pageId);
  if (page) {
    response.status(200).json(page.items);
  } else {
    response.status(404).send(`Page ${pageId} not found!`);
  }
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
  const pageId = request.params.pageId;
  const page = notebook.pages.find(page => page.id === pageId);
  if (page) {
    const {text, done} = request.body;
    if (text != undefined && done != undefined) {
      const newItem = {
        "id": `${uuidv4()}`,
        "text": text,
        "done": done
      }
      page.items.push(newItem)
      response.sendStatus(201);
    } else {
      response.sendStatus(400);
    }
  } else {
    response.status(404).send(`Page ${pageId} not found!`);
  }
});


/**
 * @swagger
 * 
 * /to-do/pages/{pageId}/items/{itemId}:
 *  get:
 *    tags:
 *      - items
 *    summary: Returns an item
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
  const {pageId, itemId} = request.params;
  const page = notebook.pages.find(page => page.id === pageId);
  if (page) {
    const item = page.items.find(item => item.id === itemId);
    if (item) {
      response.status(200).json(item);
    } else {
      response.status(404).send(`Item ${itemId} not found!`);
    }
  } else {
    response.status(404).send(`Page ${pageId} not found!`);
  }
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
  const {pageId, itemId} = request.params;
  const page = notebook.pages.find(page => page.id === pageId);
  if (page) {
    const items = page.items;
    const itemIndex = items.findIndex(item => item.id === itemId);
    if (itemIndex != -1) {
      const {text, done} = request.body;
      if (text != undefined && done != undefined) {
        items.splice(itemIndex, 1);
        const newItem = {
          "id": itemId,
          "text": text,
          "done": done
        }
        items.push(newItem)
        response.sendStatus(200);
      } else {
        response.sendStatus(400);
      }
    } else {
      response.status(404).send(`Item ${itemId} not found!`);
    }
  } else {
    response.status(404).send(`Page ${pageId} not found!`);
  }
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
  const {itemId, pageId} = request.params;
  const page = notebook.pages.find(page => page.id === pageId);
  if (page) {
    const items = page.items;
    const itemIndex = items.findIndex(item => item.id === itemId);
    if (itemIndex != -1) {
      items.splice(itemIndex, 1);
      response.sendStatus(200);
    } else {
      response.status(404).send(`Item ${itemId} not found!`);
    }
  } else {
    response.status(404).send(`Page ${pageId} not found!`);
  }
});

module.exports.getItems = getItems;
module.exports.getItem = getItem;
module.exports.addItem = addItem;
module.exports.updateItem = updateItem;
module.exports.deleteItem = deleteItem;
