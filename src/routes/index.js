const express = require('express');
const router = express.Router();

const commonController = require('../controllers/commonController');

router.route('/')
  .get(commonController.index)
  .all(commonController.methodNotAllowed);

module.exports = router;
