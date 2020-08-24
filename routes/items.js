var express = require('express');
var router = express.Router();

const {items} = require('../data/data');

/* GET items */
router.get('/', function(req, res) {
  res.send(items);
});

module.exports = router;
