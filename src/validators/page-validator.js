const {check, validationResult} = require('express-validator');

const validatePageId = [
  check('pageId')
    .not().isEmpty()
    .isLength({min: 24, max: 24})
];

const validate = (request, response, next) => {
    const errors = validationResult(request);
    if (errors.isEmpty()) {
      return next();
    } else {
      return response.status(400).json({errors: errors.array()});
    }
};

module.exports.validatePageId = validatePageId;
module.exports.validate = validate;
