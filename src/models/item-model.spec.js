const mongoose = require('mongoose')

const mongoHandler = require('../controllers/mongo-memory-server-handler')
const ItemModel = require('./item-model')

beforeAll(async () => {
  await mongoHandler.connect()
})

afterEach(async () => {
  await mongoHandler.clearDatabase()
})

afterAll(async () => {
  await mongoHandler.closeDatabase()
})

describe('Item model tests', () => {
  it('findById returns an item', async () => {
    const pageId = mongoose.Types.ObjectId()
    const itemInstance = new ItemModel({page: pageId, text: "Buy groceries", done: true})
    const savedItem = await itemInstance.save()
    const item = await ItemModel.findById(savedItem._id)
    expect(item._id).toBeTruthy()
  })
  
  it('find returns a list of items', async () => {
    const pageId = mongoose.Types.ObjectId()
    const itemInstance = new ItemModel({page: pageId, text: "Buy groceries", done: true})
    await itemInstance.save()
    const items = await ItemModel.find({})
    expect(items).toHaveLength(1)
  })
  
  it('create saves an item', async () => {
    const pageId = mongoose.Types.ObjectId()
    const item = await ItemModel.create({page: pageId, text: "Buy groceries", done: true})
    expect(item).toBeTruthy()
  })

  it('findByIdAndDelete deletes an item', async () => {
    const pageId = mongoose.Types.ObjectId()
    const itemInstance = new ItemModel({page: pageId, text: "Buy groceries", done: true})
    const savedItem = await itemInstance.save()
    const item = await ItemModel.findByIdAndDelete(savedItem._id)
    expect(item._id).toBeTruthy()
  })
})
