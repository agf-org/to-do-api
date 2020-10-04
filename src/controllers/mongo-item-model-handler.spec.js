const mongoose = require('mongoose')

const mongoPageModelHandler = require('./mongo-page-model-handler')
const mongoItemModelHandler = require('./mongo-item-model-handler')
const ItemModel = require('../models/item-model')

describe('Items database handler tests', () => {
  it('getItem should call findById', async () => {
    const itemId = mongoose.Types.ObjectId()
    ItemModel.findById = jest.fn()
    await mongoItemModelHandler.getItem(itemId)
    expect(ItemModel.findById).toHaveBeenCalledTimes(1)
    expect(ItemModel.findById).toHaveBeenCalledWith(itemId)
  })

  it('getAllItems should call find', async () => {
    ItemModel.find = jest.fn()
    await mongoItemModelHandler.getAllItems()
    expect(ItemModel.find).toHaveBeenCalledTimes(1)
    expect(ItemModel.find).toHaveBeenCalledWith({})
  })

  it('createItem should call create', async () => {
    const itemData = {text: "Buy groceries", done: true}
    ItemModel.create = jest.fn()
    await mongoItemModelHandler.createItem(itemData)
    expect(ItemModel.create).toHaveBeenCalledTimes(1)
    expect(ItemModel.create).toHaveBeenCalledWith(itemData)
  })

  it('addItem should call createItem and addItemIdToPage', async () => {
    const pageId = mongoose.Types.ObjectId()
    const itemData = {text: "Buy groceries", done: true}
    const itemInstance = new ItemModel(itemData)
    mongoItemModelHandler.createItem = jest.fn(() => itemInstance)
    mongoPageModelHandler.addItemIdToPage = jest.fn()
    await mongoItemModelHandler.addItem(pageId, itemData)
    expect(itemData.page).toBe(pageId)
    expect(mongoItemModelHandler.createItem).toHaveBeenCalledTimes(1)
    expect(mongoItemModelHandler.createItem).toHaveBeenCalledWith(itemData)
    expect(mongoPageModelHandler.addItemIdToPage).toHaveBeenCalledTimes(1)
    expect(mongoPageModelHandler.addItemIdToPage).toHaveBeenCalledWith(pageId, itemInstance._id)
  })

  it('updateItem should call getItem and addItemIdToPage', async () => {
    const itemId = mongoose.Types.ObjectId()
    const itemData = {text: "Buy groceries", done: true}
    const itemInstance = new ItemModel(itemData)
    mongoItemModelHandler.getItem = jest.fn(() => itemInstance)
    itemInstance.save = jest.fn()
    await mongoItemModelHandler.updateItem(itemId, itemData)
    expect(itemInstance.text).toBe(itemData.text)
    expect(itemInstance.done).toBe(itemData.done)
    expect(mongoItemModelHandler.getItem).toHaveBeenCalledTimes(1)
    expect(mongoItemModelHandler.getItem).toHaveBeenCalledWith(itemId)
    expect(itemInstance.save).toHaveBeenCalledTimes(1)
    expect(itemInstance.save).toHaveBeenCalledWith()
  })
  
  it('destroyItem should call delete', async () => {
    const itemId = mongoose.Types.ObjectId()
    ItemModel.findByIdAndDelete = jest.fn()
    await mongoItemModelHandler.destroyItem(itemId)
    expect(ItemModel.findByIdAndDelete).toHaveBeenCalledTimes(1)
    expect(ItemModel.findByIdAndDelete).toHaveBeenCalledWith(itemId)
  })
  
  it('deleteItem should call delete', async () => {
    const pageId = mongoose.Types.ObjectId()
    const itemId = mongoose.Types.ObjectId()
    mongoPageModelHandler.deleteItemIdFromPage = jest.fn()
    mongoItemModelHandler.destroyItem = jest.fn()
    await mongoItemModelHandler.deleteItem(pageId, itemId)
    expect(mongoPageModelHandler.deleteItemIdFromPage).toHaveBeenCalledTimes(1)
    expect(mongoPageModelHandler.deleteItemIdFromPage).toHaveBeenCalledWith(pageId, itemId)
    expect(mongoItemModelHandler.destroyItem).toHaveBeenCalledTimes(1)
    expect(mongoItemModelHandler.destroyItem).toHaveBeenCalledWith(itemId)
  })
})
