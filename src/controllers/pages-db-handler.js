const PageModel = require('../models/page-model')

module.exports.getPage = async (pageId) => {
  return await PageModel.findById(pageId)
}

module.exports.deletePage = async (page) => {
  return await page.delete()
}

module.exports.getAllPages = async () => {
  return await PageModel.find({})
}

module.exports.createEmptyPage = async () => {
  const newPage = new PageModel({
    items: []
  })
  return await newPage.save()
}

module.exports.deleteItemRefFromPage = async (page, item) => {
  const itemIndex = page.items.indexOf(item)
  page.items.splice(itemIndex, 1)
  await page.save()
}

module.exports.addItemRefToPage = async (page, item) => {
  await page.items.push(item)
  await page.save()
}
