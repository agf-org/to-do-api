const asyncHandler = require('express-async-handler');

const {notebook} = require('../models/notebook');

const pageExists = asyncHandler(async (request, response, next) => {
  const pageId = request.params.pageId;
  const page = notebook.pages.find(page => page.id === pageId);
  if (!page) {
    return response.status(404).send(`Page ${pageId} not found!`);
  }
  next();
});

module.exports.pageExists = pageExists;
