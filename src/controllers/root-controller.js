const asyncHandler = require('express-async-handler')

/**
 * @swagger
 * 
 * /:
 *   get:
 *     tags:
 *       - Root
 *     summary: Gets the API status
 *     responses:
 *       200:
 *         description: OK
 */
module.exports.getStatus = asyncHandler(async (request, response) => {
  response.sendStatus(200)
})
