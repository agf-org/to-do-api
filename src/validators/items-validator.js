const {check, validationResult} = require('express-validator');

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

module.exports.validateItem = validateItem;
module.exports.validate = validate;
