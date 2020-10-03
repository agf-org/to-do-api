const mongoose = require('mongoose')

const pagesDbHandler = require('./pages-db-handler')
const PageModel = require('../models/page-model')

describe('Pages database handler tests', () => {
  it('getPage should call findById', async () => {
    const pageId = mongoose.Types.ObjectId()
    PageModel.findById = jest.fn()
    await pagesDbHandler.getPage(pageId)
    expect(PageModel.findById).toHaveBeenCalledTimes(1)
    expect(PageModel.findById).toHaveBeenCalledWith(pageId)
  })

  it('getAllPages should call find', async () => {
    PageModel.find = jest.fn()
    await pagesDbHandler.getAllPages()
    expect(PageModel.find).toHaveBeenCalledTimes(1)
    expect(PageModel.find).toHaveBeenCalledWith({})
  })

  it('createPage should call create', async () => {
    PageModel.create = jest.fn()
    await pagesDbHandler.createPage()
    expect(PageModel.create).toHaveBeenCalledTimes(1)
    expect(PageModel.create).toHaveBeenCalledWith({items: []})
  })
  
  it('destroyPage should call delete', async () => {
    const pageId = mongoose.Types.ObjectId()
    PageModel.findByIdAndDelete = jest.fn()
    await pagesDbHandler.destroyPage(pageId)
    expect(PageModel.findByIdAndDelete).toHaveBeenCalledTimes(1)
    expect(PageModel.findByIdAndDelete).toHaveBeenCalledWith(pageId)
  })
  
  it('addItemIdToPage should add an item id to a page', async () => {
    const pageInstance = new PageModel({items: []})
    const itemId = mongoose.Types.ObjectId()
    pagesDbHandler.getPage = jest.fn(() => pageInstance)
    pageInstance.save = jest.fn()
    await pagesDbHandler.addItemIdToPage(pageInstance._id, itemId)
    expect(pagesDbHandler.getPage).toHaveBeenCalledTimes(1)
    expect(pagesDbHandler.getPage).toHaveBeenCalledWith(pageInstance._id)
    expect(Array.from(pageInstance.items)).toEqual([itemId])
    expect(pageInstance.save).toHaveBeenCalledTimes(1)
    expect(pageInstance.save).toHaveBeenCalledWith()
  })
  
  it('deleteItemIdFromPage should delete an item id from a page', async () => {
    const itemId = mongoose.Types.ObjectId()
    const pageInstance = new PageModel({items: [itemId]})
    pagesDbHandler.getPage = jest.fn(() => pageInstance)
    pageInstance.save = jest.fn()
    await pagesDbHandler.deleteItemIdFromPage(pageInstance._id, itemId)
    expect(pagesDbHandler.getPage).toHaveBeenCalledTimes(1)
    expect(pagesDbHandler.getPage).toHaveBeenCalledWith(pageInstance._id)
    expect(Array.from(pageInstance.items)).toEqual([])
    expect(pageInstance.save).toHaveBeenCalledTimes(1)
    expect(pageInstance.save).toHaveBeenCalledWith()
  })
})
