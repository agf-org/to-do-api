const express = require('express');
const router = express.Router();

const commonController = require('../controllers/common-controller');
const itemsValidator = require('../validators/items-validator');
const itemsController = require('../controllers/items-controller');
const pagesController = require('../controllers/pages-controller');

router.use(
  '/pages/:pageId/items/:itemId',
  commonController.methodsAllowed(['GET', 'PUT', 'DELETE']),
  pagesController.getPageIfExists,
  itemsController.getItemIfExists
);
router.route(
  '/pages/:pageId/items/:itemId'
)
  .get(
    itemsController.getItem
  )
  .put(
    itemsValidator.validateItem,
    itemsValidator.validate,
    itemsController.updateItem
  )
  .delete(
    itemsController.deleteItem
  );

router.use(
  '/pages/:pageId/items',
  commonController.methodsAllowed(['GET', 'POST']),
  pagesController.getPageIfExists
);
router.route(
  '/pages/:pageId/items'
)
  .get(
    itemsController.getItems
  )
  .post(
    itemsValidator.validateItem,
    itemsValidator.validate,
    itemsController.addItem
  );

router.use(
  '/pages',
  commonController.methodsAllowed(['GET', 'POST'])
);
router.route(
  '/pages'
)
  .get(
    pagesController.getPages
  )
  .post(
    pagesController.addPage
  );

module.exports = router;
