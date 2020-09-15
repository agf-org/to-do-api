const asyncHandler = require('express-async-handler');

const {notebook} = require('../models/notebook');

const getPageIfExists = asyncHandler(async (request, response, next) => {
  const pageId = request.params.pageId;
  const page = notebook.pages.find(page => page.id === pageId);
  if (page) {
    response.locals.page = page;
    return next();
  } else {
    return response.status(404).send(`Page ${pageId} not found!`);
  }
});

module.exports.getPageIfExists = getPageIfExists;
