const {check, validationResult} = require('express-validator')

const validatePageId = [
  check('pageId')
    .not().isEmpty()
    .isLength({min: 24, max: 24}),
  (request, response, next) => {
    const errors = validationResult(request)
    if (errors.isEmpty()) {
      return next()
    } else {
      return response.sendStatus(400)
    }
  }
]

module.exports.validatePageId = validatePageId
