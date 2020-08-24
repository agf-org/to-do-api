var express = require('express');
var router = express.Router();

/* GET root */
router.get('/', function(req, res) {
  res.status(200).send('OK');
});

module.exports = router;
