const asyncHandler = require('express-async-handler')

const ItemModel = require('../models/item-model')

const isItemInPage = (page, itemId) => {
  return page.items.includes(itemId)
}

const getItemIfExists = asyncHandler(async (request, response, next) => {
  const page = response.locals.page
  const itemId = request.params.itemId
  const item = await ItemModel.findById(itemId)
  if (isItemInPage(page, itemId) && item) {
    response.locals.item = item
    return next()
  } else {
    return response.status(404).send(`Item ${itemId} not found!`)
  }
})

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
const getItem = asyncHandler(async (request, response) => {
  const item = response.locals.item
  response.status(200).json(item)
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
const updateItem = asyncHandler(async (request, response) => {
  const item = response.locals.item
  const {text, done} = request.body
  item.text = text
  item.done = done
  const savedItem = await item.save()
  response.status(200).send(savedItem)
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
const deleteItem = asyncHandler(async (request, response) => {
  const page = response.locals.page
  const item = response.locals.item
  const deletedItem = await item.delete()
  const deletedItemIndex = page.items.indexOf(deletedItem)
  page.items.splice(deletedItemIndex, 1)
  await page.save()
  response.status(200).send(deletedItem)
})

/**
 * @swagger
 * 
 * /to-do/pages/{pageId}/items:
 *   get:
 *     tags:
 *       - Items
 *     summary: Gets all items of a page
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
const getItems = asyncHandler(async (request, response) => {
  const page = response.locals.page
  const items = await Promise.all(
    page.items.map(async (itemId) => await ItemModel.findById(itemId))
  )
  response.status(200).send(items)
})

/**
 * @swagger
 * 
 * /to-do/pages/{pageId}/items:
 *   post:
 *     tags:
 *       - Items
 *     summary: Adds an item
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
const addItem = asyncHandler(async (request, response) => {
  const page = response.locals.page
  const {text, done} = request.body
  const newItem = new ItemModel({
    page: page._id,
    text: text,
    done: done
  })
  const savedItem = await newItem.save()
  await page.items.push(savedItem)
  await page.save()
  response.status(201).json(savedItem)
})

module.exports.getItemIfExists = getItemIfExists
module.exports.getItem = getItem
module.exports.updateItem = updateItem
module.exports.deleteItem = deleteItem
module.exports.getItems = getItems
module.exports.addItem = addItem
