const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const {v4: uuidv4} = require('uuid');

const {items} = require('../model/data');

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
 * /items:
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
  response.status(200).json(items);
});

/**
 * @swagger
 * 
 * /items:
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
    items.push(newItem)
    response.sendStatus(201);
  } else {
    response.sendStatus(400);
  }
});


/**
 * @swagger
 * 
 * /items/{id}:
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
  const item = items.find(item => item.id == id);
  if (item) {
    response.status(200).json(item);
  } else {
    response.sendStatus(404);
  }
});

/**
 * @swagger
 * 
 * /items/{id}:
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
 * /items/{id}:
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
  const itemIndex = items.findIndex(item => item.id == id);
  if (itemIndex != -1) {
    items.splice(itemIndex, 1);
    response.sendStatus(200);
  } else {
    response.sendStatus(404);
  }
});

const methodNotAllowed = asyncHandler(async (request, response) => {
  response.sendStatus(405);
});

router.route('/')
  .get(getItems)
  .post(addItem)
  .all(methodNotAllowed)

router.route('/:id')
  .get(getItem)
  .put(updateItem)
  .delete(deleteItem)
  .all(methodNotAllowed)

module.exports = router;
