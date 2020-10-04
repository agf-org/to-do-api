const asyncHandler = require('express-async-handler')

const mongoPageModelHandler = require('./mongo-page-model-handler')
const mongoItemModelHandler = require('./mongo-item-model-handler')

/**
 * @swagger
 * 
 * /to-do/pages/{pageId}:
 *   get:
 *     tags:
 *       - Pages
 *     summary: Gets a page
 *     parameters:
 *       - name: pageId
 *         description: ID of the page
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/Page'
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Not Found
 */
module.exports.getPage = asyncHandler(async (request, response) => {
  const pageId = request.params.pageId
  const page = await mongoPageModelHandler.getPage(pageId)
  if (page) {
    response.status(200).json(page)
  } else {
    response.status(404).send(`Page ${pageId} not found!`)
  }
})

/**
 * @swagger
 * 
 * /to-do/pages/{pageId}:
 *   delete:
 *     tags:
 *       - Pages
 *     summary: Deletes a page
 *     parameters:
 *       - name: pageId
 *         description: ID of the page
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Not Found
 */
module.exports.deletePage = asyncHandler(async (request, response) => {
  const pageId = request.params.pageId
  const page = await mongoPageModelHandler.destroyPage(pageId)
  if (page) {
    for (const itemId of page.items) {
      await mongoItemModelHandler.destroyItem(itemId)
    }
    response.status(200).json(page)
  } else {
    response.status(404).send(`Page ${pageId} not found!`)
  }
})

/**
 * @swagger
 * 
 * /to-do/pages:
 *   get:
 *     tags:
 *       - Pages
 *     summary: Gets all pages
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/Pages'
 */
module.exports.getAllPages = asyncHandler(async (request, response) => {
  const pages = await mongoPageModelHandler.getAllPages()
  response.status(200).json(pages)
})

/**
 * @swagger
 * 
 * /to-do/pages:
 *   post:
 *     tags:
 *       - Pages
 *     summary: Creates a page
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/Page'
 */
module.exports.createPage = asyncHandler(async (request, response) => {
  const page = await mongoPageModelHandler.createPage()
  response.status(201).json(page)
})
