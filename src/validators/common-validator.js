const asyncHandler = require('express-async-handler');

const validateMethod = (methods) => asyncHandler(async (request, response, next) => {
  if (methods.includes(request.method)) {
    return next();
  } else {
    return response.sendStatus(405);
  }
});

module.exports.validateMethod = validateMethod;
