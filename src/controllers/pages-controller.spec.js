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

describe(`${config.baseUrl}/pages/:pageId`, () => {
  describe('Get a page', () => {
    it('should return a 200 response', async () => {
      const createdPage = await mongoPageModelHandler.createPage({items: []})
      const response = await request(app)
        .get(`${config.baseUrl}/pages/${createdPage._id}`)
      expect(response.statusCode).toBe(200)
      expect(response.type).toBe('application/json')
    })

    it('should return a page', async () => {
      const createdPage = await mongoPageModelHandler.createPage({items: []})
      const response = await request(app)
        .get(`${config.baseUrl}/pages/${createdPage._id}`)
      expect(response.body._id).toBe(createdPage._id.toString())
      expect(response.body.items).toEqual(Array.from(createdPage.items))
    })

    it('should return a 404 response for a non-existing page', async () => {
      const nonExistingId = mongoose.Types.ObjectId()
      const response = await request(app)
        .get(`${config.baseUrl}/pages/${nonExistingId}`)
      expect(response.statusCode).toBe(404)
      expect(response.type).toBe('text/html')
      expect(response.text).toBe(`Page ${nonExistingId} not found!`)
    })
  })
  
  describe('Delete a page', () => {
    it('should return a 200 response', async () => {
      const createdPage = await mongoPageModelHandler.createPage({items: []})
      const response = await request(app)
        .delete(`${config.baseUrl}/pages/${createdPage._id}`)
      expect(response.statusCode).toBe(200)
      expect(response.type).toBe('application/json')
    })

    it('should return a page', async () => {
      const createdPage = await mongoPageModelHandler.createPage({items: []})
      const response = await request(app)
        .delete(`${config.baseUrl}/pages/${createdPage._id}`)
      expect(response.body._id).toBe(createdPage._id.toString())
      expect(response.body.items).toEqual(Array.from(createdPage.items))
    })

    it('should delete its items', async () => {
      const createdPage = await mongoPageModelHandler.createPage({items: []})
      const createdItem = await mongoItemModelHandler.addItem(createdPage._id, {text: "Buy groceries", done: false})
      await request(app)
        .delete(`${config.baseUrl}/pages/${createdPage._id}`)
      const item = await mongoItemModelHandler.getItem(createdItem._id)
      expect(item).toBeFalsy()
    })

    it('should return a 404 response for a non-existing page', async () => {
      const nonExistingId = mongoose.Types.ObjectId()
      const response = await request(app)
        .delete(`${config.baseUrl}/pages/${nonExistingId}`)
      expect(response.statusCode).toBe(404)
      expect(response.type).toBe('text/html')
      expect(response.text).toBe(`Page ${nonExistingId} not found!`)
    })
  })
  
  it('should return a 405 response for an unsupported request method', async () => {
    const createdPage = await mongoPageModelHandler.createPage({items: []})
    const response = await request(app)
      .patch(`${config.baseUrl}/pages/${createdPage._id}`)
    expect(response.statusCode).toBe(405)
    expect(response.type).toBe('text/plain')
    expect(response.text).toBe('Method Not Allowed')
  })
})

describe(`${config.baseUrl}/pages`, () => {
  describe('Get all pages', () => {
    it('should return a 200 response', async () => {
      await mongoPageModelHandler.createPage({items: []})
      const response = await request(app)
        .get(`${config.baseUrl}/pages`)
      expect(response.statusCode).toBe(200)
      expect(response.type).toBe('application/json')
    })

    it('should return a list of pages', async () => {
      const createdPage = await mongoPageModelHandler.createPage({items: []})
      const response = await request(app)
        .get(`${config.baseUrl}/pages`)
      expect(response.body.length).toBe(1)
      expect(response.body[0]._id).toBe(createdPage._id.toString())
      expect(response.body[0].items).toEqual(Array.from(createdPage.items))
    })
  })

  describe('Create a page', () => {
    it('should return a 201 response', async () => {
      const response = await request(app)
        .post(`${config.baseUrl}/pages`)
      expect(response.statusCode).toBe(201)
      expect(response.type).toBe('application/json')
    })

    it('should return a page', async () => {
      const response = await request(app)
        .post(`${config.baseUrl}/pages`)
      expect(typeof response.body._id).toBe('string')
      expect(response.body.items).toEqual([])
    })
  })
  
  it('should return a 405 response for an unsupported request method', async () => {
    await mongoPageModelHandler.createPage({items: []})
    const response = await request(app)
      .patch(`${config.baseUrl}/pages`)
    expect(response.statusCode).toBe(405)
    expect(response.type).toBe('text/plain')
    expect(response.text).toBe('Method Not Allowed')
  })
})

