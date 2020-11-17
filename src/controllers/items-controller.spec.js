const request = require('supertest')
const mongoose = require('mongoose')

const config = require('../config')
const app = require('../app')
const mongoMemoryServerHandler = require('./mongo-memory-server-handler')
const mongoPageModelHandler = require('./mongo-page-model-handler')
const mongoItemModelHandler = require('./mongo-item-model-handler')

beforeAll(async () => {
  await mongoMemoryServerHandler.connect()
})

afterEach(async () => {
  await mongoMemoryServerHandler.clearDatabase()
})

afterAll(async () => {
  await mongoMemoryServerHandler.closeDatabase()
})

describe(`${config.baseUrl}/pages/:pageId/items/:itemId`, () => {
  describe('Get an item', () => {
    it('should return a 200 response', async () => {
      const createdPage = await mongoPageModelHandler.createPage({items: []})
      const createdItem = await mongoItemModelHandler.addItem(createdPage._id, {text: "Buy groceries", done: false})
      const response = await request(app)
        .get(`${config.baseUrl}/pages/${createdPage._id}/items/${createdItem._id}`)
      expect(response.statusCode).toBe(200)
      expect(response.type).toBe('application/json')
    })

    it('should return an item', async () => {
      const createdPage = await mongoPageModelHandler.createPage({items: []})
      const createdItem = await mongoItemModelHandler.addItem(createdPage._id, {text: "Buy groceries", done: false})
      const response = await request(app)
        .get(`${config.baseUrl}/pages/${createdPage._id}/items/${createdItem._id}`)
      expect(response.body._id).toBe(createdItem._id.toString())
      expect(response.body.text).toBe(createdItem.text)
      expect(response.body.done).toBe(createdItem.done)
    })

    it('should return a 404 response for a non-existing page', async () => {
      const createdPage = await mongoPageModelHandler.createPage({items: []})
      const createdItem = await mongoItemModelHandler.addItem(createdPage._id, {text: "Buy groceries", done: false})
      const nonExistingId = mongoose.Types.ObjectId()
      const response = await request(app)
        .get(`${config.baseUrl}/pages/${nonExistingId}/items/${createdItem._id}`)
      expect(response.statusCode).toBe(404)
      expect(response.type).toBe('text/html')
      expect(response.text).toBe(`Page ${nonExistingId} not found!`)
    })

    it('should return a 404 response for a non-existing item', async () => {
      const createdPage = await mongoPageModelHandler.createPage({items: []})
      await mongoItemModelHandler.addItem(createdPage._id, {text: "Buy groceries", done: false})
      const nonExistingId = mongoose.Types.ObjectId()
      const response = await request(app)
        .get(`${config.baseUrl}/pages/${createdPage._id}/items/${nonExistingId}`)
      expect(response.statusCode).toBe(404)
      expect(response.type).toBe('text/html')
      expect(response.text).toBe(`Item ${nonExistingId} not found!`)
    })
  })

  describe('Update an item', () => {
    it('should return a 200 response', async () => {
      const createdPage = await mongoPageModelHandler.createPage({items: []})
      const createdItem = await mongoItemModelHandler.addItem(createdPage._id, {text: "Buy groceries", done: false})
      const response = await request(app)
        .put(`${config.baseUrl}/pages/${createdPage._id}/items/${createdItem._id}`)
        .send({text: "Buy groceries", done: true})
      expect(response.statusCode).toBe(200)
      expect(response.type).toBe('application/json')
    })

    it('should return an item', async () => {
      const createdPage = await mongoPageModelHandler.createPage({items: []})
      const createdItem = await mongoItemModelHandler.addItem(createdPage._id, {text: "Buy groceries", done: false})
      const itemData = {text: "Buy groceries", done: true}
      const response = await request(app)
        .put(`${config.baseUrl}/pages/${createdPage._id}/items/${createdItem._id}`)
        .send(itemData)
      expect(response.body._id).toBe(createdItem._id.toString())
      expect(response.body.text).toBe(itemData.text)
      expect(response.body.done).toBe(itemData.done)
    })

    it('should return a 400 response for an item without a text field', async () => {
      const createdPage = await mongoPageModelHandler.createPage({items: []})
      const createdItem = await mongoItemModelHandler.addItem(createdPage._id, {text: "Buy groceries", done: false})
      const response = await request(app)
        .put(`${config.baseUrl}/pages/${createdPage._id}/items/${createdItem._id}`)
        .send({done: false})
      expect(response.statusCode).toBe(400)
      expect(response.type).toBe('text/plain')
    })

    it('should return a 400 response for an item with a text field that is not a string', async () => {
      const createdPage = await mongoPageModelHandler.createPage({items: []})
      const createdItem = await mongoItemModelHandler.addItem(createdPage._id, {text: "Buy groceries", done: false})
      const response = await request(app)
        .put(`${config.baseUrl}/pages/${createdPage._id}/items/${createdItem._id}`)
        .send({text: 0, done: false})
      expect(response.statusCode).toBe(400)
      expect(response.type).toBe('text/plain')
    })

    it('should return a 400 response for an item with a text field that is empty', async () => {
      const createdPage = await mongoPageModelHandler.createPage({items: []})
      const createdItem = await mongoItemModelHandler.addItem(createdPage._id, {text: "Buy groceries", done: false})
      const response = await request(app)
        .put(`${config.baseUrl}/pages/${createdPage._id}/items/${createdItem._id}`)
        .send({text: "",  done: false})
      expect(response.statusCode).toBe(400)
      expect(response.type).toBe('text/plain')
    })

    it('should return a 400 response for an item without a done field', async () => {
      const createdPage = await mongoPageModelHandler.createPage({items: []})
      const createdItem = await mongoItemModelHandler.addItem(createdPage._id, {text: "Buy groceries", done: false})
      const response = await request(app)
        .put(`${config.baseUrl}/pages/${createdPage._id}/items/${createdItem._id}`)
        .send({text: "Buy groceries"})
      expect(response.statusCode).toBe(400)
      expect(response.type).toBe('text/plain')
    })

    it('should return a 400 response for an item with a done field that is not a boolean', async () => {
      const createdPage = await mongoPageModelHandler.createPage({items: []})
      const createdItem = await mongoItemModelHandler.addItem(createdPage._id, {text: "Buy groceries", done: false})
      const response = await request(app)
        .put(`${config.baseUrl}/pages/${createdPage._id}/items/${createdItem._id}`)
        .send({text: "Buy groceries", done: "not a boolean"})
      expect(response.statusCode).toBe(400)
      expect(response.type).toBe('text/plain')
    })

    it('should return a 404 response for a non-existing page', async () => {
      const createdPage = await mongoPageModelHandler.createPage({items: []})
      const createdItem = await mongoItemModelHandler.addItem(createdPage._id, {text: "Buy groceries", done: false})
      const nonExistingId = mongoose.Types.ObjectId()
      const response = await request(app)
        .put(`${config.baseUrl}/pages/${nonExistingId}/items/${createdItem._id}`)
        .send({text: "Buy groceries", done: true})
      expect(response.statusCode).toBe(404)
      expect(response.type).toBe('text/html')
      expect(response.text).toBe(`Page ${nonExistingId} not found!`)
    })

    it('should return a 404 response for a non-existing item', async () => {
      const createdPage = await mongoPageModelHandler.createPage({items: []})
      await mongoItemModelHandler.addItem(createdPage._id, {text: "Buy groceries", done: false})
      const nonExistingId = mongoose.Types.ObjectId()
      const response = await request(app)
        .put(`${config.baseUrl}/pages/${createdPage._id}/items/${nonExistingId}`)
        .send({text: "Buy groceries", done: true})
      expect(response.statusCode).toBe(404)
      expect(response.type).toBe('text/html')
      expect(response.text).toBe(`Item ${nonExistingId} not found!`)
    })
  })
  
  describe('Delete an item', () => {
    it('should return a 200 response', async () => {
      const createdPage = await mongoPageModelHandler.createPage({items: []})
      const createdItem = await mongoItemModelHandler.addItem(createdPage._id, {text: "Buy groceries", done: false})
      const response = await request(app)
        .delete(`${config.baseUrl}/pages/${createdPage._id}/items/${createdItem._id}`)
      expect(response.statusCode).toBe(200)
      expect(response.type).toBe('application/json')
    })

    it('should return an item', async () => {
      const createdPage = await mongoPageModelHandler.createPage({items: []})
      const createdItem = await mongoItemModelHandler.addItem(createdPage._id, {text: "Buy groceries", done: false})
      const response = await request(app)
        .delete(`${config.baseUrl}/pages/${createdPage._id}/items/${createdItem._id}`)
      expect(response.body._id).toBe(createdItem._id.toString())
      expect(response.body.text).toBe(createdItem.text)
      expect(response.body.done).toBe(createdItem.done)
    })

    it('should delete the item id in the page', async () => {
      const createdPage = await mongoPageModelHandler.createPage({items: []})
      const createdItem = await mongoItemModelHandler.addItem(createdPage._id, {text: "Buy groceries", done: false})
      await request(app)
        .delete(`${config.baseUrl}/pages/${createdPage._id}/items/${createdItem._id}`)
      const page = await mongoPageModelHandler.getPage(createdPage._id)
      expect(Array.from(page.items)).toEqual([])
    })

    it('should return a 404 response for a non-existing page', async () => {
      const createdPage = await mongoPageModelHandler.createPage({items: []})
      const createdItem = await mongoItemModelHandler.addItem(createdPage._id, {text: "Buy groceries", done: false})
      const nonExistingId = mongoose.Types.ObjectId()
      const response = await request(app)
        .delete(`${config.baseUrl}/pages/${nonExistingId}/items/${createdItem._id}`)
      expect(response.statusCode).toBe(404)
      expect(response.type).toBe('text/html')
      expect(response.text).toBe(`Page ${nonExistingId} not found!`)
    })

    it('should return a 404 response for a non-existing item', async () => {
      const createdPage = await mongoPageModelHandler.createPage({items: []})
      await mongoItemModelHandler.addItem(createdPage._id, {text: "Buy groceries", done: false})
      const nonExistingId = mongoose.Types.ObjectId()
      const response = await request(app)
        .delete(`${config.baseUrl}/pages/${createdPage._id}/items/${nonExistingId}`)
      expect(response.statusCode).toBe(404)
      expect(response.type).toBe('text/html')
      expect(response.text).toBe(`Item ${nonExistingId} not found!`)
    })
  })
  
  it('should return a 405 response for an unsupported request method', async () => {
    const createdPage = await mongoPageModelHandler.createPage({items: []})
    const createdItem = await mongoItemModelHandler.addItem(createdPage._id, {text: "Buy groceries", done: false})
    const response = await request(app)
      .patch(`${config.baseUrl}/pages/${createdPage._id}/items/${createdItem._id}`)
    expect(response.statusCode).toBe(405)
    expect(response.type).toBe('text/plain')
    expect(response.text).toBe('Method Not Allowed')
  })
})

describe(`${config.baseUrl}/pages/:pageId/items tests`, () => {
  describe('Get all items', () => {
    it('should return a 200 response', async () => {
      const createdPage = await mongoPageModelHandler.createPage({items: []})
      await mongoItemModelHandler.addItem(createdPage._id, {text: "Buy groceries", done: false})
      const response = await request(app)
        .get(`${config.baseUrl}/pages/${createdPage._id}/items`)
      expect(response.statusCode).toBe(200)
      expect(response.type).toBe('application/json')
    })

    it('should return a list of items', async () => {
      const createdPage = await mongoPageModelHandler.createPage({items: []})
      const createdItem = await mongoItemModelHandler.addItem(createdPage._id, {text: "Buy groceries", done: false})
      const response = await request(app)
        .get(`${config.baseUrl}/pages/${createdPage._id}/items`)
      expect(response.body.length).toBe(1)
      expect(response.body[0]._id).toBe(createdItem._id.toString())
      expect(response.body[0].text).toBe(createdItem.text)
      expect(response.body[0].done).toBe(createdItem.done)
    })

    it('should return a 404 response for a non-existing page', async () => {
      const createdPage = await mongoPageModelHandler.createPage({items: []})
      await mongoItemModelHandler.addItem(createdPage._id, {text: "Buy groceries", done: false})
      const nonExistingId = mongoose.Types.ObjectId()
      const response = await request(app)
        .get(`${config.baseUrl}/pages/${nonExistingId}/items`)
      expect(response.statusCode).toBe(404)
      expect(response.type).toBe('text/html')
      expect(response.text).toBe(`Page ${nonExistingId} not found!`)
    })
  })

  describe('Create an item', () => {
    it('should return a 201 response', async () => {
      const createdPage = await mongoPageModelHandler.createPage({items: []})
      const itemData = {text: "Buy groceries", done: true}
      const response = await request(app)
        .post(`${config.baseUrl}/pages/${createdPage._id}/items`)
        .send(itemData)
      expect(response.statusCode).toBe(201)
      expect(response.type).toBe('application/json')
    })

    it('should return an item', async () => {
      const createdPage = await mongoPageModelHandler.createPage({items: []})
      const itemData = {text: "Buy groceries", done: true}
      const response = await request(app)
        .post(`${config.baseUrl}/pages/${createdPage._id}/items`)
        .send(itemData)
      expect(typeof response.body._id).toBe('string')
      expect(response.body.text).toBe(itemData.text)
      expect(response.body.done).toBe(itemData.done)
    })

    it('should add the page id to the item', async () => {
      const createdPage = await mongoPageModelHandler.createPage({items: []})
      const itemData = {text: "Buy groceries", done: true}
      const response = await request(app)
        .post(`${config.baseUrl}/pages/${createdPage._id}/items`)
        .send(itemData)
      const item = await mongoItemModelHandler.getItem(response.body._id)
      expect(item.page).toEqual(createdPage._id)
    })

    it('should add the item id to the page', async () => {
      const createdPage = await mongoPageModelHandler.createPage({items: []})
      const itemData = {text: "Buy groceries", done: true}
      const response = await request(app)
        .post(`${config.baseUrl}/pages/${createdPage._id}/items`)
        .send(itemData)
      const page = await mongoPageModelHandler.getPage(createdPage._id)
      expect(page.items.map(item => item._id.toString())).toEqual([response.body._id])
    })

    it('should return a 400 response for an item without a text field', async () => {
      const createdPage = await mongoPageModelHandler.createPage({items: []})
      const response = await request(app)
        .post(`${config.baseUrl}/pages/${createdPage._id}/items`)
        .send({done: false})
      expect(response.statusCode).toBe(400)
      expect(response.type).toBe('text/plain')
    })

    it('should return a 400 response for an item with a text field that is not a string', async () => {
      const createdPage = await mongoPageModelHandler.createPage({items: []})
      const response = await request(app)
        .post(`${config.baseUrl}/pages/${createdPage._id}/items`)
        .send({text: 0, done: false})
      expect(response.statusCode).toBe(400)
      expect(response.type).toBe('text/plain')
    })

    it('should return a 400 response for an item with a text field that is empty', async () => {
      const createdPage = await mongoPageModelHandler.createPage({items: []})
      const response = await request(app)
        .post(`${config.baseUrl}/pages/${createdPage._id}/items`)
        .send({text: "", done: false})
      expect(response.statusCode).toBe(400)
      expect(response.type).toBe('text/plain')
    })

    it('should return a 400 response for an item without a done field', async () => {
      const createdPage = await mongoPageModelHandler.createPage({items: []})
      const response = await request(app)
        .post(`${config.baseUrl}/pages/${createdPage._id}/items`)
        .send({text: "Buy groceries"})
      expect(response.statusCode).toBe(400)
      expect(response.type).toBe('text/plain')
    })

    it('should return a 400 response for an item with a done field that is not a boolean', async () => {
      const createdPage = await mongoPageModelHandler.createPage({items: []})
      const response = await request(app)
        .post(`${config.baseUrl}/pages/${createdPage._id}/items`)
        .send({ text: "Buy groceries", done: "not a boolean"})
      expect(response.statusCode).toBe(400)
      expect(response.type).toBe('text/plain')
    })

    it('should return a 404 response for a non-existing page', async () => {
      await mongoPageModelHandler.createPage({items: []})
      const nonExistingId = mongoose.Types.ObjectId()
      const response = await request(app)
        .post(`${config.baseUrl}/pages/${nonExistingId}/items`)
        .send({text: "Buy groceries", done: false})
      expect(response.statusCode).toBe(404)
      expect(response.type).toBe('text/html')
      expect(response.text).toBe(`Page ${nonExistingId} not found!`)
    })
  })
  
  it('should return a 405 response for an unsupported request method', async () => {
    const createdPage = await mongoPageModelHandler.createPage({items: []})
    const response = await request(app)
      .patch(`${config.baseUrl}/pages/${createdPage._id}/items`)
    expect(response.statusCode).toBe(405)
    expect(response.type).toBe('text/plain')
    expect(response.text).toBe('Method Not Allowed')
  })
})
