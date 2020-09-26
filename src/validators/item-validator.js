const {check, validationResult} = require('express-validator');

const validateItemId = [
  check('itemId')
    .not().isEmpty()
    .isLength({min: 24, max: 24}),
  (request, response, next) => {
    const errors = validationResult(request);
    if (errors.isEmpty()) {
      return next();
    } else {
      return response.sendStatus(400);
    }
  }
];

const validateItem = [
  check('text')
    .isString()
    .trim()
    .not().isEmpty()
    .escape(),
  check('done')
    .isBoolean(),
  (request, response, next) => {
    const errors = validationResult(request);
    if (errors.isEmpty()) {
      return next();
    } else {
      return response.sendStatus(400);
    }
  }
];

module.exports.validateItemId = validateItemId;
module.exports.validateItem = validateItem;
