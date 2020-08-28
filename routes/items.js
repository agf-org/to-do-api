var express = require('express');
var router = express.Router();

const {items} = require('../data/data');

const getItems = (request, response) => response.status(200).send(items);

const methodNotAllowed = (request, response) => response.sendStatus(405);

router.route('/')
  .get(getItems)
  .all(methodNotAllowed)

module.exports = router;
