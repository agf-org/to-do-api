const app = require('../app');
const request = require('supertest');
const mongoose = require('mongoose');
const mongoHandler = require('./mongo-memory-server-handler');

const config = require('../config');
const PageModel = require('../models/page-model');

beforeAll(async () => {
  await mongoHandler.connect();
});

afterEach(async () => {
  await mongoHandler.clearDatabase();
});

afterAll(async () => {
  await mongoHandler.closeDatabase();
});

describe(`${config.baseUrl}/to-do/pages/:pageId`, () => {
  describe('Get a page', () => {
    it('should return a 200 response', async () => {
      const page = new PageModel({items: []});
      const savedPage = await page.save();
      const response = await request(app)
        .get(`${config.baseUrl}/to-do/pages/${savedPage._id}`);
      expect(response.statusCode).toBe(200);
      expect(response.type).toBe('application/json');
    });

    it('should return a page', async () => {
      const page = new PageModel({items: []});
      const savedPage = await page.save();
      const response = await request(app)
        .get(`${config.baseUrl}/to-do/pages/${savedPage._id}`);
      expect(response.body._id).toBe(savedPage._id.toString());
      expect(response.body.items).toMatchObject(Array.from(savedPage.items));
    });

    it('should return a 404 response for a non-existing page', async () => {
      const nonExistingId = mongoose.Types.ObjectId();
      const response = await request(app)
        .get(`${config.baseUrl}/to-do/pages/${nonExistingId}`);
      expect(response.statusCode).toBe(404);
      expect(response.type).toBe('text/html');
      expect(response.text).toBe(`Page ${nonExistingId} not found!`);
    });
  });
  
  describe('Delete a page', () => {
    it('should return a 200 response', async () => {
      const page = new PageModel({items: []});
      const savedPage = await page.save();
      const response = await request(app)
        .delete(`${config.baseUrl}/to-do/pages/${savedPage._id}`);
      expect(response.statusCode).toBe(200);
      expect(response.type).toBe('application/json');
    });

    it('should return a page', async () => {
      const page = new PageModel({items: []});
      const savedPage = await page.save();
      const response = await request(app)
        .delete(`${config.baseUrl}/to-do/pages/${savedPage._id}`);
      expect(response.body._id).toBe(savedPage._id.toString());
      expect(response.body.items).toMatchObject(Array.from(savedPage.items));
    });

    it('should return a 404 response for a non-existing page', async () => {
      const nonExistingId = mongoose.Types.ObjectId();
      const response = await request(app)
        .delete(`${config.baseUrl}/to-do/pages/${nonExistingId}`);
      expect(response.statusCode).toBe(404);
      expect(response.type).toBe('text/html');
      expect(response.text).toBe(`Page ${nonExistingId} not found!`);
    });
  });
  
  it('should return a 405 response for an unsupported request method', async () => {
    const page = new PageModel({items: []});
    const savedPage = await page.save();
    const response = await request(app)
      .patch(`${config.baseUrl}/to-do/pages/${savedPage._id}`);
    expect(response.statusCode).toBe(405);
    expect(response.type).toBe('text/plain');
    expect(response.text).toBe('Method Not Allowed');
  });
});

describe(`${config.baseUrl}/to-do/pages`, () => {
  describe('Get all pages', () => {
    it('should return a 200 response', async () => {
      const page = new PageModel({items: []});
      await page.save();
      const response = await request(app)
        .get(`${config.baseUrl}/to-do/pages`);
      expect(response.statusCode).toBe(200);
      expect(response.type).toBe('application/json');
    });

    it('should return a list of pages', async () => {
      const page = new PageModel({items: []});
      const savedPage = await page.save();
      const response = await request(app)
        .get(`${config.baseUrl}/to-do/pages`);
      expect(response.body.length).toBe(1);
      expect(response.body[0]._id).toBe(savedPage._id.toString());
      expect(response.body[0].items).toMatchObject(Array.from(savedPage.items));
    });
  });

  describe('Add a page', () => {
    it('should return a 201 response', async () => {
      const response = await request(app)
        .post(`${config.baseUrl}/to-do/pages`);
      expect(response.statusCode).toBe(201);
      expect(response.type).toBe('application/json');
    });

    it('should return a page', async () => {
      const response = await request(app)
        .post(`${config.baseUrl}/to-do/pages`);
      expect(typeof response.body._id).toBe('string');
      expect(response.body.items).toEqual([]);
    });
  });
  
  it('should return a 405 response for an unsupported request method', async () => {
    const page = new PageModel({items: []});
    await page.save();
    const response = await request(app)
      .patch(`${config.baseUrl}/to-do/pages`);
    expect(response.statusCode).toBe(405);
    expect(response.type).toBe('text/plain');
    expect(response.text).toBe('Method Not Allowed');
  });
});

