const asyncHandler = require('express-async-handler')

const ItemModel = require('../models/item-model')
const pageDbController = require('./page-db-controller')

const getItemIfExists = asyncHandler(async (request, response, next) => {
  const pageId = request.params.pageId
  const page = await pageDbController.getPage(pageId)
  if (page) {
    const itemId = request.params.itemId
    const isItemInPage = page.items.includes(itemId)
    const item = await ItemModel.findById(itemId)
    if (isItemInPage && item) {
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
const getItemInPage = asyncHandler(async (request, response) => {
  const pageId = request.params.pageId
  const page = await pageDbController.getPage(pageId)
  if (page) {
    const itemId = request.params.itemId
    const isItemInPage = page.items.includes(itemId)
    const item = await ItemModel.findById(itemId)
    if (isItemInPage && item) {
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
const updateItemInPage = asyncHandler(async (request, response) => {
  const pageId = request.params.pageId
  const page = await pageDbController.getPage(pageId)
  if (page) {
    const itemId = request.params.itemId
    const isItemInPage = page.items.includes(itemId)
    const item = await ItemModel.findById(itemId)
    if (isItemInPage && item) {
      const {text, done} = request.body
      item.text = text
      item.done = done
      const savedItem = await item.save()
      response.status(200).json(savedItem)
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
const deleteItemInPage = asyncHandler(async (request, response) => {
  const pageId = request.params.pageId
  const page = await pageDbController.getPage(pageId)
  if (page) {
    const itemId = request.params.itemId
    const isItemInPage = page.items.includes(itemId)
    const item = await ItemModel.findById(itemId)
    if (isItemInPage && item) {
      const deletedItem = await item.delete()
      const deletedItemIndex = page.items.indexOf(deletedItem)
      page.items.splice(deletedItemIndex, 1)
      await page.save()
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
const getAllItemsInPage = asyncHandler(async (request, response) => {
  const pageId = request.params.pageId
  const page = await pageDbController.getPage(pageId)
  if (page) {
    const items = await Promise.all(
      page.items.map(async (itemId) => await ItemModel.findById(itemId))
    )
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
const addItemInPage = asyncHandler(async (request, response) => {
  const pageId = request.params.pageId
  const page = await pageDbController.getPage(pageId)
  if (page) {
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
  } else {
    response.status(404).send(`Page ${pageId} not found!`)
  }
})

module.exports.getItemInPage = getItemInPage
module.exports.updateItemInPage = updateItemInPage
module.exports.deleteItemInPage = deleteItemInPage
module.exports.getAllItemsInPage = getAllItemsInPage
module.exports.addItemInPage = addItemInPage
