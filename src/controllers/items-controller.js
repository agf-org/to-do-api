const asyncHandler = require('express-async-handler');

const ItemModel = require('../models/item-model');

const getItemIfExists = asyncHandler(async (request, response, next) => {
  const itemId = request.params.itemId;
  const item = response.locals.page.items.find(item => item.id === itemId);
  if (item) {
    response.locals.item = item;
    return next();
  } else {
    return response.status(404).send(`Item ${itemId} not found!`);
  }
});

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
  response.status(200).json(response.locals.item);
});

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
  const {text, done} = request.body;
  response.locals.item.text = text;
  response.locals.item.done = done;
  const item = await response.locals.item.save();
  response.status(200).send(item);
});

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
    const item = await response.locals.item.delete();
    const itemIndex = response.locals.page.items.indexOf(item);
    response.locals.page.items.splice(itemIndex, 1);
    await response.locals.page.save();
    response.status(200).send(item);
});

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
  response.status(200).send(response.locals.page.items);
});

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
    const {text, done} = request.body;
    const newItem = new ItemModel({
      page: response.locals.page._id,
      text: text,
      done: done
    });
    const item = await newItem.save();
    await response.locals.page.items.push(item);
    await response.locals.page.save();
    response.status(201).json(item);
});

module.exports.getItemIfExists = getItemIfExists;
module.exports.getItem = getItem;
module.exports.updateItem = updateItem;
module.exports.deleteItem = deleteItem;
module.exports.getItems = getItems;
module.exports.addItem = addItem;
