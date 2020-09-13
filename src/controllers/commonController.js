const asyncHandler = require('express-async-handler');

const index = asyncHandler(async (request, response) => {
  response.sendStatus(200)
});

const methodNotAllowed = asyncHandler(async (request, response) => {
  response.sendStatus(405);
});

module.exports.index = index;
module.exports.methodNotAllowed = methodNotAllowed;
