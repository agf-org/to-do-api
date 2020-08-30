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
 *    description: Gets all the items
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
  response.status(200).send(items);
});

const methodNotAllowed = asyncHandler(async (request, response) => {
  response.sendStatus(405);
});

router.route('/')
  .get(getItems)
  .all(methodNotAllowed)

module.exports = router;
