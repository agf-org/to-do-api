const mongoose = require('mongoose')

const pagesDbHandler = require('./pages-db-handler')
const itemsDbHandler = require('./items-db-handler')
const ItemModel = require('../models/item-model')

describe('Items database handler tests', () => {
  it('getItem should call findById', async () => {
    const itemId = mongoose.Types.ObjectId()
    ItemModel.findById = jest.fn()
    await itemsDbHandler.getItem(itemId)
    expect(ItemModel.findById).toHaveBeenCalledTimes(1)
    expect(ItemModel.findById).toHaveBeenCalledWith(itemId)
  })

  it('getAllItems should call find', async () => {
    ItemModel.find = jest.fn()
    await itemsDbHandler.getAllItems()
    expect(ItemModel.find).toHaveBeenCalledTimes(1)
    expect(ItemModel.find).toHaveBeenCalledWith({})
  })

  it('createItem should call create', async () => {
    const itemData = {text: "Buy groceries", done: true}
    ItemModel.create = jest.fn()
    await itemsDbHandler.createItem(itemData)
    expect(ItemModel.create).toHaveBeenCalledTimes(1)
    expect(ItemModel.create).toHaveBeenCalledWith(itemData)
  })

  it('addItem should call createItem and addItemIdToPage', async () => {
    const pageId = mongoose.Types.ObjectId()
    const itemData = {text: "Buy groceries", done: true}
    const itemInstance = new ItemModel(itemData)
    itemsDbHandler.createItem = jest.fn(() => itemInstance)
    pagesDbHandler.addItemIdToPage = jest.fn()
    await itemsDbHandler.addItem(pageId, itemData)
    expect(itemData.page).toBe(pageId)
    expect(itemsDbHandler.createItem).toHaveBeenCalledTimes(1)
    expect(itemsDbHandler.createItem).toHaveBeenCalledWith(itemData)
    expect(pagesDbHandler.addItemIdToPage).toHaveBeenCalledTimes(1)
    expect(pagesDbHandler.addItemIdToPage).toHaveBeenCalledWith(pageId, itemInstance._id)
  })

  it('updateItem should call getItem and addItemIdToPage', async () => {
    const itemId = mongoose.Types.ObjectId()
    const itemData = {text: "Buy groceries", done: true}
    const itemInstance = new ItemModel(itemData)
    itemsDbHandler.getItem = jest.fn(() => itemInstance)
    itemInstance.save = jest.fn()
    await itemsDbHandler.updateItem(itemId, itemData)
    expect(itemInstance.text).toBe(itemData.text)
    expect(itemInstance.done).toBe(itemData.done)
    expect(itemsDbHandler.getItem).toHaveBeenCalledTimes(1)
    expect(itemsDbHandler.getItem).toHaveBeenCalledWith(itemId)
    expect(itemInstance.save).toHaveBeenCalledTimes(1)
    expect(itemInstance.save).toHaveBeenCalledWith()
  })
  
  it('destroyItem should call delete', async () => {
    const itemId = mongoose.Types.ObjectId()
    ItemModel.findByIdAndDelete = jest.fn()
    await itemsDbHandler.destroyItem(itemId)
    expect(ItemModel.findByIdAndDelete).toHaveBeenCalledTimes(1)
    expect(ItemModel.findByIdAndDelete).toHaveBeenCalledWith(itemId)
  })
  
  it('deleteItem should call delete', async () => {
    const pageId = mongoose.Types.ObjectId()
    const itemId = mongoose.Types.ObjectId()
    pagesDbHandler.deleteItemIdFromPage = jest.fn()
    itemsDbHandler.destroyItem = jest.fn()
    await itemsDbHandler.deleteItem(pageId, itemId)
    expect(pagesDbHandler.deleteItemIdFromPage).toHaveBeenCalledTimes(1)
    expect(pagesDbHandler.deleteItemIdFromPage).toHaveBeenCalledWith(pageId, itemId)
    expect(itemsDbHandler.destroyItem).toHaveBeenCalledTimes(1)
    expect(itemsDbHandler.destroyItem).toHaveBeenCalledWith(itemId)
  })
})
