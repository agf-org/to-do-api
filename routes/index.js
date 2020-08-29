const express = require('express');
const router = express.Router();

/**
 * @swagger
 * 
 * /:
 *  get:
 *    tags:
 *      - root
 *    description: Root path
 *    produces:
 *      - text/plain
 *    responses:
 *      200:
 *        description: OK
 *      404:
 *        description: Not Found
 *      405:
 *        description: Method Not Allowed
 */
const getRoot = (request, response) => response.sendStatus(200);

const methodNotAllowed = (request, response) => response.sendStatus(405);

router.route('/')
    .get(getRoot)
    .all(methodNotAllowed);

module.exports = router;
