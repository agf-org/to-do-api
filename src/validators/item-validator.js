const {check, validationResult} = require('express-validator');

const validateItemId = [
  check('itemId')
    .not().isEmpty()
    .isLength({min: 24, max: 24})
];

const validateItem = [
  check('text')
    .isString()
    .trim()
    .not().isEmpty()
    .escape(),
  check('done')
    .isBoolean()
];

const validate = (request, response, next) => {
    const errors = validationResult(request);
    if (errors.isEmpty()) {
      return next();
    } else {
      return response.status(400).json({errors: errors.array()});
    }
};

module.exports.validateItemId = validateItemId;
module.exports.validateItem = validateItem;
module.exports.validate = validate;
