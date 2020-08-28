var express = require('express');
var router = express.Router();

const getRoot = (request, response) => response.sendStatus(200);

const methodNotAllowed = (request, response) => response.sendStatus(405);

router.route('/')
    .get(getRoot)
    .all(methodNotAllowed);

module.exports = router;
