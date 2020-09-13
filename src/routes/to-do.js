const express = require('express');
const router = express.Router();

const itemController = require('../controllers/itemController');
const commonController = require('../controllers/commonController');

router.route('/')
  .get(commonController.index)
  .all(commonController.methodNotAllowed);

router.route('/items')
  .get(itemController.getItems)
  .post(itemController.addItem)
  .all(commonController.methodNotAllowed);

router.route('/items/:id')
  .get(itemController.getItem)
  .put(itemController.updateItem)
  .delete(itemController.deleteItem)
  .all(commonController.methodNotAllowed);

module.exports = router;
