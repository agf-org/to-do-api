const asyncHandler = require('express-async-handler')

const pagesDbHandler = require('./pages-db-handler')
const itemsDbHandler = require('./items-db-handler')

/**
 * @swagger
 * 
 * /to-do/pages/{pageId}/items/{itemId}:
 *   get:
 *     tags:
 *       - Items
 *     summary: Gets an item
 *     parameters:
 *       - name: pageId
 *         description: ID of the page
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *       - name: itemId
 *         description: ID of the item
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
 *               $ref: '#/definitions/Item'
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Not Found
 */
module.exports.getItem = asyncHandler(async (request, response) => {
  const pageId = request.params.pageId
  const page = await pagesDbHandler.getPage(pageId)
  if (page) {
    const itemId = request.params.itemId
    const item = await itemsDbHandler.getItem(itemId)
    if (item) {
      response.status(200).json(item)
    } else {
      response.status(404).send(`Item ${itemId} not found!`)
    }
  } else {
    response.status(404).send(`Page ${pageId} not found!`)
  }
})

/**
 * @swagger
 * 
 * /to-do/pages/{pageId}/items/{itemId}:
 *   put:
 *     tags:
 *       - Items
 *     summary: Updates an item
 *     parameters:
 *       - name: pageId
 *         description: ID of the page
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *       - name: itemId
 *         description: ID of the item
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *         name: item
 *         description: Object representing the item
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/NewItem'
 *     responses:
 *       200:
 *         description: OK
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Not Found
 */
module.exports.updateItem = asyncHandler(async (request, response) => {
  const pageId = request.params.pageId
  const page = await pagesDbHandler.getPage(pageId)
  if (page) {
    const itemId = request.params.itemId
    const item = await itemsDbHandler.getItem(itemId)
    if (item) {
      const updatedInfo = request.body
      const updatedItem = await itemsDbHandler.updateItem(itemId, updatedInfo)
      response.status(200).json(updatedItem)
    } else {
      response.status(404).send(`Item ${itemId} not found!`)
    }
  } else {
    response.status(404).send(`Page ${pageId} not found!`)
  }
})

/**
 * @swagger
 * 
 * /to-do/pages/{pageId}/items/{itemId}:
 *   delete:
 *     tags:
 *       - Items
 *     summary: Deletes an item
 *     parameters:
 *       - name: pageId
 *         description: ID of the page
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *       - name: itemId
 *         description: ID of the item
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
module.exports.deleteItem = asyncHandler(async (request, response) => {
  const pageId = request.params.pageId
  const page = await pagesDbHandler.getPage(pageId)
  if (page) {
    const itemId = request.params.itemId
    const item = await itemsDbHandler.getItem(itemId)
    if (item) {
      const deletedItem = await itemsDbHandler.deleteItem(pageId, itemId)
      response.status(200).json(deletedItem)
    } else {
      response.status(404).send(`Item ${itemId} not found!`)
    }
  } else {
    response.status(404).send(`Page ${pageId} not found!`)
  }
})

/**
 * @swagger
 * 
 * /to-do/pages/{pageId}/items:
 *   get:
 *     tags:
 *       - Items
 *     summary: Gets all items
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
 *               $ref: '#/definitions/Items'
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Not Found
 */
module.exports.getAllItems = asyncHandler(async (request, response) => {
  const pageId = request.params.pageId
  const page = await pagesDbHandler.getPage(pageId)
  if (page) {
    const items = await itemsDbHandler.getAllItems(pageId)
    response.status(200).json(items)
  } else {
    response.status(404).send(`Page ${pageId} not found!`)
  }
})

/**
 * @swagger
 * 
 * /to-do/pages/{pageId}/items:
 *   post:
 *     tags:
 *       - Items
 *     summary: Creates an item
 *     parameters:
 *       - name: pageId
 *         description: ID of the page
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *         name: item
 *         description: Object representing the item
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/NewItem'
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/Item'
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Not Found
 */
module.exports.createItem = asyncHandler(async (request, response) => {
  const pageId = request.params.pageId
  const page = await pagesDbHandler.getPage(pageId)
  if (page) {
    const data = request.body
    const createdItem = await itemsDbHandler.addItem(pageId, data)
    response.status(201).json(createdItem)
  } else {
    response.status(404).send(`Page ${pageId} not found!`)
  }
})
