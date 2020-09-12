const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const {v4: uuidv4} = require('uuid');

const {items} = require('../data/data');

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
 *     properties:
 *       text:
 *         type: string
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
 *    produces:
 *      - application/json
 *    responses:
 *      200:
 *        description: OK
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/definitions/Items'
 *      404:
 *        description: Not Found
 *      405:
 *        description: Method Not Allowed
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
 *    consumes:
 *      - application/json
 *    requestBody:
 *        name: Text item
 *        description: Object with the text of the item
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
 *      405:
 *        description: Method Not Allowed
 */
const addItem = asyncHandler(async (request, response) => {
  const {text} = request.body;
  if (text) {
    const newItem = {
      "id": `${uuidv4()}`,
      "text": text,
      "done": false
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
 *      - name: ID
 *        description: ID of the item
 *        in: path
 *        required: true
 *        schema:
 *          type: string
 *    produces:
 *      - application/json
 *    responses:
 *      200:
 *        description: OK
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/definitions/Item'
 *      404:
 *        description: Not Found
 *      405:
 *        description: Method Not Allowed
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

const methodNotAllowed = asyncHandler(async (request, response) => {
  response.sendStatus(405);
});

router.route('/')
  .get(getItems)
  .post(addItem)
  .all(methodNotAllowed)

router.route('/:id')
  .get(getItem)
  .all(methodNotAllowed)

module.exports = router;
