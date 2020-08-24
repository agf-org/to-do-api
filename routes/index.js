var express = require('express');
var router = express.Router();

/* GET root */
router.get('/', function(req, res) {
  res.sendStatus(200);
});

module.exports = router;
