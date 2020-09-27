const app = require('../app');
const request = require('supertest');
const mongoose = require('mongoose');
const mongoHandler = require('./mongo-memory-server-handler');

const config = require('../config');
const PageModel = require('../models/page-model');
const ItemModel = require('../models/item-model');

beforeAll(async () => {
  await mongoHandler.connect();
});

afterEach(async () => {
  await mongoHandler.clearDatabase();
});

afterAll(async () => {
  await mongoHandler.closeDatabase();
});

describe(`${config.baseUrl}/to-do/pages/:pageId/items/:itemId`, () => {
  describe('Get an item', () => {
    it('should return a 200 response', async () => {
      const page = new PageModel({items: []});
      const item = new ItemModel({page: page._id, text: "Buy groceries", done: false});
      const savedItem = await item.save();
      await page.items.push(item);
      const savedPage = await page.save();
      const response = await request(app)
        .get(`${config.baseUrl}/to-do/pages/${savedPage._id}/items/${savedItem._id}`);
      expect(response.statusCode).toBe(200);
      expect(response.type).toBe('application/json');
    });

    it('should return an item', async () => {
      const page = new PageModel({items: []});
      const item = new ItemModel({page: page._id, text: "Buy groceries", done: false});
      const savedItem = await item.save();
      await page.items.push(item);
      const savedPage = await page.save();
      const response = await request(app)
        .get(`${config.baseUrl}/to-do/pages/${savedPage._id}/items/${savedItem._id}`);
      expect(response.body._id).toBe(savedItem._id.toString());
      expect(response.body.text).toBe(savedItem.text);
      expect(response.body.done).toBe(savedItem.done);
    });

    it('should return a 404 response for a non-existing page', async () => {
      const page = new PageModel({items: []});
      const item = new ItemModel({page: page._id, text: "Buy groceries", done: false});
      const savedItem = await item.save();
      await page.items.push(item);
      await page.save();
      const nonExistingId = mongoose.Types.ObjectId();
      const response = await request(app)
        .get(`${config.baseUrl}/to-do/pages/${nonExistingId}/items/${savedItem._id}`);
      expect(response.statusCode).toBe(404);
      expect(response.type).toBe('text/html');
      expect(response.text).toBe(`Page ${nonExistingId} not found!`);
    });

    it('should return a 404 response for a non-existing item', async () => {
      const page = new PageModel({items: []});
      const item = new ItemModel({page: page._id, text: "Buy groceries", done: false});
      await item.save();
      await page.items.push(item);
      const savedPage = await page.save();
      const nonExistingId = mongoose.Types.ObjectId();
      const response = await request(app)
        .get(`${config.baseUrl}/to-do/pages/${savedPage._id}/items/${nonExistingId}`);
      expect(response.statusCode).toBe(404);
      expect(response.type).toBe('text/html');
      expect(response.text).toBe(`Item ${nonExistingId} not found!`);
    });
  });

  describe('Update an item', () => {
    it('should return a 200 response', async () => {
      const page = new PageModel({items: []});
      const item = new ItemModel({page: page._id, text: "Buy groceries", done: false});
      const savedItem = await item.save();
      await page.items.push(item);
      const savedPage = await page.save();
      const response = await request(app)
        .put(`${config.baseUrl}/to-do/pages/${savedPage._id}/items/${savedItem._id}`)
        .send({
          "text": "Buy groceries",
          "done": true
        });
      expect(response.statusCode).toBe(200);
      expect(response.type).toBe('application/json');
    });

    it('should return an item', async () => {
      const page = new PageModel({items: []});
      const item = new ItemModel({page: page._id, text: "Buy groceries", done: false});
      const savedItem = await item.save();
      await page.items.push(item);
      const savedPage = await page.save();
      const updatedItem = {
        "text": "Buy groceries",
        "done": true
      };
      const response = await request(app)
        .put(`${config.baseUrl}/to-do/pages/${savedPage._id}/items/${savedItem._id}`)
        .send(updatedItem);
      expect(response.body._id).toBe(savedItem._id.toString());
      expect(response.body.text).toBe(updatedItem.text);
      expect(response.body.done).toBe(updatedItem.done);
    });

    it('should return a 400 response for an item without a "text" field', async () => {
      const page = new PageModel({items: []});
      const item = new ItemModel({page: page._id, text: "Buy groceries", done: false});
      const savedItem = await item.save();
      await page.items.push(item);
      const savedPage = await page.save();
      const response = await request(app)
        .put(`${config.baseUrl}/to-do/pages/${savedPage._id}/items/${savedItem._id}`)
        .send({
          "done": false
        });
      expect(response.statusCode).toBe(400);
      expect(response.type).toBe('text/plain');
    });

    it('should return a 400 response for an item with a "text" field that is not a string', async () => {
      const page = new PageModel({items: []});
      const item = new ItemModel({page: page._id, text: "Buy groceries", done: false});
      const savedItem = await item.save();
      await page.items.push(item);
      const savedPage = await page.save();
      const response = await request(app)
        .put(`${config.baseUrl}/to-do/pages/${savedPage._id}/items/${savedItem._id}`)
        .send({
          "text": 0,
          "done": false
        });
      expect(response.statusCode).toBe(400);
      expect(response.type).toBe('text/plain');
    });

    it('should return a 400 response for an item with a "text" field that is empty', async () => {
      const page = new PageModel({items: []});
      const item = new ItemModel({page: page._id, text: "Buy groceries", done: false});
      const savedItem = await item.save();
      await page.items.push(item);
      const savedPage = await page.save();
      const response = await request(app)
        .put(`${config.baseUrl}/to-do/pages/${savedPage._id}/items/${savedItem._id}`)
        .send({
          "text": "",
          "done": false
        });
      expect(response.statusCode).toBe(400);
      expect(response.type).toBe('text/plain');
    });

    it('should return a 400 response for an item without a "done" field', async () => {
      const page = new PageModel({items: []});
      const item = new ItemModel({page: page._id, text: "Buy groceries", done: false});
      const savedItem = await item.save();
      await page.items.push(item);
      const savedPage = await page.save();
      const response = await request(app)
        .put(`${config.baseUrl}/to-do/pages/${savedPage._id}/items/${savedItem._id}`)
        .send({
          "text": "Buy groceries"
        });
      expect(response.statusCode).toBe(400);
      expect(response.type).toBe('text/plain');
    });

    it('should return a 400 response for an item with a "done" field that is not a boolean', async () => {
      const page = new PageModel({items: []});
      const item = new ItemModel({page: page._id, text: "Buy groceries", done: false});
      const savedItem = await item.save();
      await page.items.push(item);
      const savedPage = await page.save();
      const response = await request(app)
        .put(`${config.baseUrl}/to-do/pages/${savedPage._id}/items/${savedItem._id}`)
        .send({
          "text": "Buy groceries",
          "done": "not a boolean"
        });
      expect(response.statusCode).toBe(400);
      expect(response.type).toBe('text/plain');
    });

    it('should return a 404 response for a non-existing page', async () => {
      const page = new PageModel({items: []});
      const item = new ItemModel({page: page._id, text: "Buy groceries", done: false});
      const savedItem = await item.save();
      await page.items.push(item);
      await page.save();
      const nonExistingId = mongoose.Types.ObjectId();
      const response = await request(app)
        .put(`${config.baseUrl}/to-do/pages/${nonExistingId}/items/${savedItem._id}`)
        .send({
          "text": "Buy groceries",
          "done": true
        });
      expect(response.statusCode).toBe(404);
      expect(response.type).toBe('text/html');
      expect(response.text).toBe(`Page ${nonExistingId} not found!`);
    });

    it('should return a 404 response for a non-existing item', async () => {
      const page = new PageModel({items: []});
      const item = new ItemModel({page: page._id, text: "Buy groceries", done: false});
      await item.save();
      await page.items.push(item);
      const savedPage = await page.save();
      const nonExistingId = mongoose.Types.ObjectId();
      const response = await request(app)
        .put(`${config.baseUrl}/to-do/pages/${savedPage._id}/items/${nonExistingId}`)
        .send({
          "text": "Buy groceries",
          "done": true
        });
      expect(response.statusCode).toBe(404);
      expect(response.type).toBe('text/html');
      expect(response.text).toBe(`Item ${nonExistingId} not found!`);
    });
  });
  
  describe('Delete an item', () => {
    it('should return a 200 response', async () => {
      const page = new PageModel({items: []});
      const item = new ItemModel({page: page._id, text: "Buy groceries", done: false});
      const savedItem = await item.save();
      await page.items.push(item);
      const savedPage = await page.save();
      const response = await request(app)
        .delete(`${config.baseUrl}/to-do/pages/${savedPage._id}/items/${savedItem._id}`);
      expect(response.statusCode).toBe(200);
      expect(response.type).toBe('application/json');
    });

    it('should return an item', async () => {
      const page = new PageModel({items: []});
      const item = new ItemModel({page: page._id, text: "Buy groceries", done: false});
      const savedItem = await item.save();
      await page.items.push(item);
      const savedPage = await page.save();
      const response = await request(app)
        .delete(`${config.baseUrl}/to-do/pages/${savedPage._id}/items/${savedItem._id}`);
      expect(response.body._id).toBe(savedItem._id.toString());
      expect(response.body.text).toBe(savedItem.text);
      expect(response.body.done).toBe(savedItem.done);
    });

    it('should return a 404 response for a non-existing page', async () => {
      const page = new PageModel({items: []});
      const item = new ItemModel({page: page._id, text: "Buy groceries", done: false});
      const savedItem = await item.save();
      await page.items.push(item);
      await page.save();
      const nonExistingId = mongoose.Types.ObjectId();
      const response = await request(app)
        .delete(`${config.baseUrl}/to-do/pages/${nonExistingId}/items/${savedItem._id}`);
      expect(response.statusCode).toBe(404);
      expect(response.type).toBe('text/html');
      expect(response.text).toBe(`Page ${nonExistingId} not found!`);
    });

    it('should return a 404 response for a non-existing item', async () => {
      const page = new PageModel({items: []});
      const item = new ItemModel({page: page._id, text: "Buy groceries", done: false});
      await item.save();
      await page.items.push(item);
      const savedPage = await page.save();
      const nonExistingId = mongoose.Types.ObjectId();
      const response = await request(app)
        .delete(`${config.baseUrl}/to-do/pages/${savedPage._id}/items/${nonExistingId}`);
      expect(response.statusCode).toBe(404);
      expect(response.type).toBe('text/html');
      expect(response.text).toBe(`Item ${nonExistingId} not found!`);
    });
  });
  
  it('should return a 405 response for an unsupported request method', async () => {
    const page = new PageModel({items: []});
    const item = new ItemModel({page: page._id, text: "Buy groceries", done: false});
    const savedItem = await item.save();
    await page.items.push(item);
    const savedPage = await page.save();
    const response = await request(app)
      .patch(`${config.baseUrl}/to-do/pages/${savedPage._id}/items/${savedItem._id}`);
    expect(response.statusCode).toBe(405);
    expect(response.type).toBe('text/plain');
    expect(response.text).toBe('Method Not Allowed');
  });
});

describe(`${config.baseUrl}/to-do/pages/:pageId/items tests`, () => {
  describe('Get all items of a page', () => {
    it('should return a 200 response', async () => {
      const page = new PageModel({items: []});
      const item = new ItemModel({page: page._id, text: "Buy groceries", done: false});
      await item.save();
      await page.items.push(item);
      const savedPage = await page.save();
      const response = await request(app)
        .get(`${config.baseUrl}/to-do/pages/${savedPage._id}/items`);
      expect(response.statusCode).toBe(200);
      expect(response.type).toBe('application/json');
    });

    it('should return a list of items', async () => {
      const page = new PageModel({items: []});
      const item = new ItemModel({page: page._id, text: "Buy groceries", done: false});
      const savedItem = await item.save();
      await page.items.push(item);
      const savedPage = await page.save();
      const response = await request(app)
        .get(`${config.baseUrl}/to-do/pages/${savedPage._id}/items`);
      expect(response.body.length).toBe(1);
      expect(response.body[0]._id).toBe(savedItem._id.toString());
      expect(response.body[0].text).toBe(savedItem.text);
      expect(response.body[0].done).toBe(savedItem.done);
    });

    it('should return a 404 response for a non-existing page', async () => {
      const page = new PageModel({items: []});
      const item = new ItemModel({page: page._id, text: "Buy groceries", done: false});
      await item.save();
      await page.items.push(item);
      await page.save();
      const nonExistingId = mongoose.Types.ObjectId();
      const response = await request(app)
        .get(`${config.baseUrl}/to-do/pages/${nonExistingId}/items`);
      expect(response.statusCode).toBe(404);
      expect(response.type).toBe('text/html');
      expect(response.text).toBe(`Page ${nonExistingId} not found!`);
    });
  });

  describe('Add an item', () => {
    it('should return a 201 response', async () => {
      const page = new PageModel({items: []});
      const savedPage = await page.save();
      const response = await request(app)
        .post(`${config.baseUrl}/to-do/pages/${savedPage._id}/items`)
        .send({
          "text": "Buy groceries",
          "done": false
        });
      expect(response.statusCode).toBe(201);
      expect(response.type).toBe('application/json');
    });

    it('should return an item', async () => {
      const page = new PageModel({items: []});
      const savedPage = await page.save();
      const itemToAdd = {
        "text": "Buy groceries",
        "done": true
      };
      const response = await request(app)
        .post(`${config.baseUrl}/to-do/pages/${savedPage._id}/items`)
        .send(itemToAdd);
      expect(typeof response.body._id).toBe('string');
      expect(response.body.text).toBe(itemToAdd.text);
      expect(response.body.done).toBe(itemToAdd.done);
    });

    it('should return a 400 response for an item without a "text" field', async () => {
      const page = new PageModel({items: []});
      const savedPage = await page.save();
      const response = await request(app)
        .post(`${config.baseUrl}/to-do/pages/${savedPage._id}/items`)
        .send({
          "done": false
        });
      expect(response.statusCode).toBe(400);
      expect(response.type).toBe('text/plain');
    });

    it('should return a 400 response for an item with a "text" field that is not a string', async () => {
      const page = new PageModel({items: []});
      const savedPage = await page.save();
      const response = await request(app)
        .post(`${config.baseUrl}/to-do/pages/${savedPage._id}/items`)
        .send({
          "text": 0,
          "done": false
        });
      expect(response.statusCode).toBe(400);
      expect(response.type).toBe('text/plain');
    });

    it('should return a 400 response for an item with a "text" field that is empty', async () => {
      const page = new PageModel({items: []});
      const savedPage = await page.save();
      const response = await request(app)
        .post(`${config.baseUrl}/to-do/pages/${savedPage._id}/items`)
        .send({
          "text": "",
          "done": false
        });
      expect(response.statusCode).toBe(400);
      expect(response.type).toBe('text/plain');
    });

    it('should return a 400 response for an item without a "done" field', async () => {
      const page = new PageModel({items: []});
      const savedPage = await page.save();
      const response = await request(app)
        .post(`${config.baseUrl}/to-do/pages/${savedPage._id}/items`)
        .send({
          "text": "Buy groceries"
        });
      expect(response.statusCode).toBe(400);
      expect(response.type).toBe('text/plain');
    });

    it('should return a 400 response for an item with a "done" field that is not a boolean', async () => {
      const page = new PageModel({items: []});
      const savedPage = await page.save();
      const response = await request(app)
        .post(`${config.baseUrl}/to-do/pages/${savedPage._id}/items`)
        .send({
          "text": "Buy groceries",
          "done": "not a boolean"
        });
      expect(response.statusCode).toBe(400);
      expect(response.type).toBe('text/plain');
    });

    it('should return a 404 response for a non-existing page', async () => {
      const page = new PageModel({items: []});
      await page.save();
      const nonExistingId = mongoose.Types.ObjectId();
      const response = await request(app)
        .post(`${config.baseUrl}/to-do/pages/${nonExistingId}/items`)
        .send({
          "text": "Buy groceries",
          "done": false
        });
      expect(response.statusCode).toBe(404);
      expect(response.type).toBe('text/html');
      expect(response.text).toBe(`Page ${nonExistingId} not found!`);
    });
  });
  
  it('should return a 405 response for an unsupported request method', async () => {
    const page = new PageModel({items: []});
    const savedPage = await page.save();
    const response = await request(app)
      .patch(`${config.baseUrl}/to-do/pages/${savedPage._id}/items`);
    expect(response.statusCode).toBe(405);
    expect(response.type).toBe('text/plain');
    expect(response.text).toBe('Method Not Allowed');
  });
});
