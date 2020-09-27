const express = require('express')
const router = express.Router()

const commonValidator = require('../validators/common-validator')
const itemValidator = require('../validators/item-validator')
const itemsController = require('../controllers/items-controller')
const pageValidator = require('../validators/page-validator')
const pagesController = require('../controllers/pages-controller')

router
  .use(
    '/pages/:pageId/items/:itemId',
    commonValidator.validateMethod(['GET', 'PUT', 'DELETE']),
    pageValidator.validatePageId,
    itemValidator.validateItemId
  )
router
  .route('/pages/:pageId/items/:itemId')
  .get(
    itemsController.getItemInPage
  )
  .put(
    itemValidator.validateItem,
    itemsController.updateItemInPage
  )
  .delete(
    itemsController.deleteItemInPage
  )

router
  .use(
    '/pages/:pageId/items',
    commonValidator.validateMethod(['GET', 'POST']),
    pageValidator.validatePageId
  )
router
  .route('/pages/:pageId/items')
  .get(
    itemsController.getAllItemsInPage
  )
  .post(
    itemValidator.validateItem,
    itemsController.createItemInPage
  )

router
  .use(
    '/pages/:pageId',
    commonValidator.validateMethod(['GET', 'DELETE']),
    pageValidator.validatePageId
  )
router
  .route('/pages/:pageId')
  .get(
    pagesController.getPage
  )
  .delete(
    pagesController.deletePage
  )

router
  .use(
    '/pages',
    commonValidator.validateMethod(['GET', 'POST'])
  )
router
  .route('/pages')
  .get(
    pagesController.getAllPages
  )
  .post(
    pagesController.createEmptyPage
  )

module.exports = router
