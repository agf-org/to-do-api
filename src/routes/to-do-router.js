const express = require('express');
const router = express.Router();

const commonController = require('../controllers/common-controller');
const itemValidator = require('../validators/item-validator');
const itemsController = require('../controllers/items-controller');
const pageValidator = require('../validators/page-validator');
const pagesController = require('../controllers/pages-controller');

router.use(
  '/pages/:pageId/items/:itemId',
  commonController.methodsAllowed(['GET', 'PUT', 'DELETE']),
  pageValidator.validatePageId,
  pageValidator.validate,
  pagesController.getPageIfExists,
  itemValidator.validateItemId,
  itemValidator.validate,
  itemsController.getItemIfExists
);
router.route('/pages/:pageId/items/:itemId')
  .get(
    itemsController.getItem
  )
  .put(
    itemValidator.validateItem,
    itemValidator.validate,
    itemsController.updateItem
  )
  .delete(
    itemsController.deleteItem
  );

router.use(
  '/pages/:pageId/items',
  commonController.methodsAllowed(['GET', 'POST']),
  pageValidator.validatePageId,
  pageValidator.validate,
  pagesController.getPageIfExists
);
router.route('/pages/:pageId/items')
  .get(
    itemsController.getItems
  )
  .post(
    itemValidator.validateItem,
    itemValidator.validate,
    itemsController.addItem
  );

router.use(
  '/pages/:pageId',
  commonController.methodsAllowed(['GET', 'DELETE']),
  pageValidator.validatePageId,
  pageValidator.validate,
  pagesController.getPageIfExists
);
router.route('/pages/:pageId')
  .get(
    pagesController.getPage
  )
  .delete(
    pagesController.deletePage
  );

router.use(
  '/pages',
  commonController.methodsAllowed(['GET', 'POST'])
);
router.route('/pages')
  .get(
    pagesController.getPages
  )
  .post(
    pagesController.addPage
  );

module.exports = router;
