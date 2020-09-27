const express = require('express');
const router = express.Router();

const commonValidator = require('../validators/common-validator');
const itemValidator = require('../validators/item-validator');
const itemsController = require('../controllers/items-controller');
const pageValidator = require('../validators/page-validator');
const pagesController = require('../controllers/pages-controller');

router
  .use(
    '/pages/:pageId/items/:itemId',
    commonValidator.validateMethod(['GET', 'PUT', 'DELETE']),
    pageValidator.validatePageId,
    pagesController.getPageIfExists,
    itemValidator.validateItemId,
    itemsController.getItemIfExists
  );
router
  .route('/pages/:pageId/items/:itemId')
  .get(
    itemsController.getItem
  )
  .put(
    itemValidator.validateItem,
    itemsController.updateItem
  )
  .delete(
    itemsController.deleteItem
  );

router
  .use(
    '/pages/:pageId/items',
    commonValidator.validateMethod(['GET', 'POST']),
    pageValidator.validatePageId,
    pagesController.getPageIfExists
  );
router
  .route('/pages/:pageId/items')
  .get(
    itemsController.getItems
  )
  .post(
    itemValidator.validateItem,
    itemsController.addItem
  );

router
  .use(
    '/pages/:pageId',
    commonValidator.validateMethod(['GET', 'DELETE']),
    pageValidator.validatePageId,
    pagesController.getPageIfExists
  );
router
  .route('/pages/:pageId')
  .get(
    pagesController.getPage
  )
  .delete(
    pagesController.deletePage
  );

router
  .use(
    '/pages',
    commonValidator.validateMethod(['GET', 'POST'])
  );
router
  .route('/pages')
  .get(
    pagesController.getPages
  )
  .post(
    pagesController.addPage
  );

module.exports = router;
