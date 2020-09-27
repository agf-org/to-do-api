const pagesDbHandler = require('./pages-db-handler')
const ItemModel = require('../models/item-model')

module.exports.getItemInPage = async (page, itemId) => {
  const isItemInPage = page.items.includes(itemId)
  const item = await ItemModel.findById(itemId)
  return isItemInPage && item
}

module.exports.updateItem = async (item, data) => {
  item.text = data.text
  item.done = data.done
  return await item.save()
}

module.exports.deleteItemInPage = async (page, item) => {
  await pagesDbHandler.deleteItemRefFromPage(page, item)
  return await item.delete()
}

module.exports.getAllItemsInPage = async (page) => {
  return await Promise.all(
    page.items.map(async (itemId) => await ItemModel.findById(itemId))
  )
}

module.exports.createItemInPage = async (page, data) => {
  const newItem = new ItemModel({
    page: page._id,
    text: data.text,
    done: data.done
  })
  await pagesDbHandler.addItemRefToPage(page, newItem)
  return await newItem.save()
}
