const express = require('express');
const router = express.Router();

const pagesController = require('../controllers/pages-controller');
const itemsController = require('../controllers/items-controller');
const commonController = require('../controllers/common-controller');

router.use(
  '/pages/:pageId/items/:itemId',
  commonController.methodsAllowed(['GET', 'PUT', 'DELETE'])
);
router.use(
  '/pages/:pageId/items/:itemId',
  pagesController.getPageIfExists,
  itemsController.getItemIfExists
);
router.route('/pages/:pageId/items/:itemId')
  .get(itemsController.getItem)
  .put(itemsController.updateItem)
  .delete(itemsController.deleteItem);

router.use(
  '/pages/:pageId/items',
  commonController.methodsAllowed(['GET', 'POST'])
);
router.use(
  '/pages/:pageId/items',
  pagesController.getPageIfExists
);
router.route('/pages/:pageId/items')
  .get(itemsController.getItems)
  .post(itemsController.addItem);

module.exports = router;
