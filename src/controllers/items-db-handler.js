const ItemModel = require('../models/item-model')
const pagesDbHandler = require('./pages-db-handler')

module.exports.getItem = async (itemId) => {
  return await ItemModel.findById(itemId)
}

module.exports.getAllItems = async (pageId) => {
  return await ItemModel.find({page: pageId})
}

module.exports.createItem = async (data) => {
  return await ItemModel.create(data)
}

module.exports.addItem = async (pageId, data) => {
  data.page = pageId
  const newItem = await this.createItem(data)
  await pagesDbHandler.addItemIdToPage(pageId, newItem._id)
  return newItem
}

module.exports.updateItem = async (itemId, data) => {
  const item = await this.getItem(itemId)
  item.text = data.text
  item.done = data.done
  return await item.save()
}

module.exports.destroyItem = async (itemId) => {
  return await ItemModel.findByIdAndDelete(itemId)
}

module.exports.deleteItem = async (pageId, itemId) => {
  await pagesDbHandler.deleteItemIdFromPage(pageId, itemId)
  return await this.destroyItem(itemId)
}
