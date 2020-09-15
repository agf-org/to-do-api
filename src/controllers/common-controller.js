const asyncHandler = require('express-async-handler');

const methodsAllowed = (methods) => asyncHandler(async (request, response, next) => {
  if (methods.includes(request.method)) {
    return next();
  } else {
    return response.sendStatus(405);
  }
});

module.exports.methodsAllowed = methodsAllowed;
