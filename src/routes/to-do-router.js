const express = require('express');
const router = express.Router();

const itemsController = require('../controllers/items-controller');
const commonController = require('../controllers/common-controller');

router.route('/pages/:pageId/items')
  .get(itemsController.getItems)
  .post(itemsController.addItem)
  .all(commonController.methodNotAllowed);

router.route('/pages/:pageId/items/:itemId')
  .get(itemsController.getItem)
  .put(itemsController.updateItem)
  .delete(itemsController.deleteItem)
  .all(commonController.methodNotAllowed);

module.exports = router;
