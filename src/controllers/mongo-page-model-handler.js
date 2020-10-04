const PageModel = require('../models/page-model')

module.exports.getPage = async (pageId) => {
  return await PageModel.findById(pageId)
}

module.exports.getAllPages = async () => {
  return await PageModel.find({})
}

module.exports.createPage = async () => {
  return await PageModel.create({items: []})
}

module.exports.destroyPage = async (pageId) => {
  return await PageModel.findByIdAndDelete(pageId)
}

module.exports.addItemIdToPage = async (pageId, itemId) => {
  const page = await this.getPage(pageId)
  await page.items.push(itemId)
  await page.save()
}

module.exports.deleteItemIdFromPage = async (pageId, itemId) => {
  const page = await this.getPage(pageId)
  const itemIndex = page.items.indexOf(itemId)
  page.items.splice(itemIndex, 1)
  await page.save()
}
