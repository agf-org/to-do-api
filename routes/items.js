const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');

const {items} = require('../data/data');

/**
 * @swagger
 *
 * definitions:
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
 *   Items:
 *     type: array
 *     items:
 *       $ref: '#/definitions/Item'
 */

/**
 * @swagger
 * 
 * /items:
 *  get:
 *    tags:
 *      - items
 *    description: Gets all items
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
 * /items/{id}:
 *  get:
 *    tags:
 *      - items
 *    description: Gets a given item
 *    parameters:
 *      - name: id
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
  .all(methodNotAllowed)

router.route('/:id')
  .get(getItem)
  .all(methodNotAllowed)

module.exports = router;
