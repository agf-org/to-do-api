const PageModel = require('../models/page-model')

const getPage = async (pageId) => {
  return await PageModel.findById(pageId)
}

module.exports.getPage = getPage
