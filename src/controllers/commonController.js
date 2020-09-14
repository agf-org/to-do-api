const asyncHandler = require('express-async-handler');

const ok = asyncHandler(async (request, response) => {
  response.sendStatus(200)
});

const methodNotAllowed = asyncHandler(async (request, response) => {
  response.sendStatus(405);
});

module.exports.ok = ok;
module.exports.methodNotAllowed = methodNotAllowed;
