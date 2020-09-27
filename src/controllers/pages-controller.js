const asyncHandler = require('express-async-handler')

const PageModel = require('../models/page-model')

const getPageIfExists = asyncHandler(async (request, response, next) => {
  const pageId = request.params.pageId
  const page = await PageModel.findById(pageId)
  if (page) {
    response.locals.page = page
    return next()
  } else {
    return response.status(404).send(`Page ${pageId} not found!`)
  }
})

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
const getPage = asyncHandler(async (request, response) => {
  const page = response.locals.page
  response.status(200).send(page)
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
const deletePage = asyncHandler(async (request, response) => {
  const page = response.locals.page
  const deletedPage = await page.delete()
  response.status(200).send(deletedPage)
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
const getAllPages = asyncHandler(async (request, response) => {
  const pages = await PageModel.find({})
  response.status(200).json(pages)
})

/**
 * @swagger
 * 
 * /to-do/pages:
 *   post:
 *     tags:
 *       - Pages
 *     summary: Adds a page
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/Page'
 */
const addPage = asyncHandler(async (request, response) => {
  const newPage = new PageModel({
    items: []
  })
  const page = await newPage.save()
  response.status(201).json(page)
})

module.exports.getPageIfExists = getPageIfExists
module.exports.getPage = getPage
module.exports.deletePage = deletePage
module.exports.getAllPages = getAllPages
module.exports.addPage = addPage
