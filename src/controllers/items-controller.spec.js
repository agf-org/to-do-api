const app = require('../app');
const request = require('supertest');
const {config} = require('../config');

describe(`${config.baseUrl}/to-do/pages/0/items tests`, () => {
  describe('Get all items', () => {
    it('should return a 200 response', async () => {
      const response = await request(app)
        .get(`${config.baseUrl}/to-do/pages/0/items`);
      expect(response.statusCode).toBe(200);
      expect(response.type).toBe('application/json');
    });

    it('should return a list of items', async () => {
      const response = await request(app)
        .get(`${config.baseUrl}/to-do/pages/0/items`);
      response.body.map(item => {
        expect(typeof item.id).toBe('string');
        expect(typeof item.text).toBe('string');
        expect(typeof item.done).toBe('boolean');
      });
    });

    it('should return a 404 response for a non-existing page', async () => {
      const response = await request(app)
        .get(`${config.baseUrl}/to-do/pages/1/items`);
      expect(response.statusCode).toBe(404);
      expect(response.type).toBe('text/html');
      expect(response.text).toBe('Page 1 not found!');
    });
  });

  describe('Add an item', () => {
    it('should return a 201 response', async () => {
      const response = await request(app)
        .post(`${config.baseUrl}/to-do/pages/0/items`)
        .send({
          "text": "test",
          "done": false
        });
      expect(response.statusCode).toBe(201);
      expect(response.type).toBe('text/plain');
      expect(response.text).toBe('Created');
    });

    it('should return a 400 response for an item without a "text" field', async () => {
      const response = await request(app)
        .post(`${config.baseUrl}/to-do/pages/0/items`)
        .send({
          "done": false
        });
      expect(response.statusCode).toBe(400);
      expect(response.type).toBe('application/json');
    });

    it('should return a 400 response for an item with a "text" field that is not a string', async () => {
      const response = await request(app)
        .post(`${config.baseUrl}/to-do/pages/0/items`)
        .send({
          "text": 0,
          "done": false
        });
      expect(response.statusCode).toBe(400);
      expect(response.type).toBe('application/json');
    });

    it('should return a 400 response for an item with a "text" field that is empty', async () => {
      const response = await request(app)
        .post(`${config.baseUrl}/to-do/pages/0/items`)
        .send({
          "text": "",
          "done": false
        });
      expect(response.statusCode).toBe(400);
      expect(response.type).toBe('application/json');
    });

    it('should return a 400 response for an item without a "done" field', async () => {
      const response = await request(app)
        .post(`${config.baseUrl}/to-do/pages/0/items`)
        .send({
          "text": "test"
        });
      expect(response.statusCode).toBe(400);
      expect(response.type).toBe('application/json');
    });

    it('should return a 400 response for an item with a "done" field that is not a boolean', async () => {
      const response = await request(app)
        .post(`${config.baseUrl}/to-do/pages/0/items`)
        .send({
          "text": "test",
          "done": "not a boolean"
        });
      expect(response.statusCode).toBe(400);
      expect(response.type).toBe('application/json');
    });

    it('should return a 404 response for a non-existing page', async () => {
      const response = await request(app)
        .post(`${config.baseUrl}/to-do/pages/1/items`)
        .send({
          "text": "test",
          "done": false
        });
      expect(response.statusCode).toBe(404);
      expect(response.type).toBe('text/html');
      expect(response.text).toBe('Page 1 not found!');
    });
  });
  
  it('should return a 405 response for an unsupported request method', async () => {
    const response = await request(app)
      .patch(`${config.baseUrl}/to-do/pages/0/items`);
    expect(response.statusCode).toBe(405);
    expect(response.type).toBe('text/plain');
    expect(response.text).toBe('Method Not Allowed');
  });
});

describe(`${config.baseUrl}/to-do/pages/0/items/:id`, () => {
  describe('Get an item', () => {
    it('should return a 200 response', async () => {
      const response = await request(app)
        .get(`${config.baseUrl}/to-do/pages/0/items/0`);
      expect(response.statusCode).toBe(200);
      expect(response.type).toBe('application/json');
    });

    it('should return an item', async () => {
      const response = await request(app)
        .get(`${config.baseUrl}/to-do/pages/0/items/0`);
      expect(typeof response.body.id).toBe('string');
      expect(typeof response.body.text).toBe('string');
      expect(typeof response.body.done).toBe('boolean');
    });

    it('should return a 404 response for a non-existing page', async () => {
      const response = await request(app)
        .get(`${config.baseUrl}/to-do/pages/1/items/0`);
      expect(response.statusCode).toBe(404);
      expect(response.type).toBe('text/html');
      expect(response.text).toBe('Page 1 not found!');
    });

    it('should return a 404 response for a non-existing item', async () => {
      const response = await request(app)
        .get(`${config.baseUrl}/to-do/pages/0/items/1`);
      expect(response.statusCode).toBe(404);
      expect(response.type).toBe('text/html');
      expect(response.text).toBe('Item 1 not found!');
    });
  });

  describe('Update an item', () => {
    it('should return a 200 response', async () => {
      const response = await request(app)
        .put(`${config.baseUrl}/to-do/pages/0/items/0`)
        .send({
          "text": "test",
          "done": false
        });
      expect(response.statusCode).toBe(200);
      expect(response.type).toBe('text/plain');
      expect(response.text).toBe('OK');
    });

    it('should return a 400 response for an item without a "text" field', async () => {
      const response = await request(app)
      .put(`${config.baseUrl}/to-do/pages/0/items/0`)
        .send({
          "done": false
        });
      expect(response.statusCode).toBe(400);
      expect(response.type).toBe('application/json');
    });

    it('should return a 400 response for an item with a "text" field that is not a string', async () => {
      const response = await request(app)
        .put(`${config.baseUrl}/to-do/pages/0/items/0`)
        .send({
          "text": 0,
          "done": false
        });
      expect(response.statusCode).toBe(400);
      expect(response.type).toBe('application/json');
    });

    it('should return a 400 response for an item with a "text" field that is empty', async () => {
      const response = await request(app)
        .put(`${config.baseUrl}/to-do/pages/0/items/0`)
        .send({
          "text": "",
          "done": false
        });
      expect(response.statusCode).toBe(400);
      expect(response.type).toBe('application/json');
    });

    it('should return a 400 response for an item without a "done" field', async () => {
      const response = await request(app)
      .put(`${config.baseUrl}/to-do/pages/0/items/0`)
        .send({
          "text": "test"
        });
      expect(response.statusCode).toBe(400);
      expect(response.type).toBe('application/json');
    });

    it('should return a 400 response for an item with a "done" field that is not a boolean', async () => {
      const response = await request(app)
        .put(`${config.baseUrl}/to-do/pages/0/items/0`)
        .send({
          "text": "test",
          "done": "not a boolean"
        });
      expect(response.statusCode).toBe(400);
      expect(response.type).toBe('application/json');
    });

    it('should return a 404 response for a non-existing page', async () => {
      const response = await request(app)
        .put(`${config.baseUrl}/to-do/pages/1/items/0`)
        .send({
          "text": "test",
          "done": false
        });
      expect(response.statusCode).toBe(404);
      expect(response.type).toBe('text/html');
      expect(response.text).toBe('Page 1 not found!');
    });

    it('should return a 404 response for a non-existing item', async () => {
      const response = await request(app)
        .put(`${config.baseUrl}/to-do/pages/0/items/1`)
        .send({
          "text": "test",
          "done": false
        });
      expect(response.statusCode).toBe(404);
      expect(response.type).toBe('text/html');
      expect(response.text).toBe('Item 1 not found!');
    });
  });
  
  describe('Delete an item', () => {
    it('should return a 200 response', async () => {
      const response = await request(app)
        .delete(`${config.baseUrl}/to-do/pages/0/items/0`);
      expect(response.statusCode).toBe(200);
      expect(response.type).toBe('text/plain');
      expect(response.text).toBe('OK');
    });

    it('should return a 404 response for a non-existing page', async () => {
      const response = await request(app)
        .delete(`${config.baseUrl}/to-do/pages/1/items/0`);
      expect(response.statusCode).toBe(404);
      expect(response.type).toBe('text/html');
      expect(response.text).toBe('Page 1 not found!');
    });

    it('should return a 404 response for a non-existing item', async () => {
      const response = await request(app)
        .delete(`${config.baseUrl}/to-do/pages/0/items/1`);
      expect(response.statusCode).toBe(404);
      expect(response.type).toBe('text/html');
      expect(response.text).toBe('Item 1 not found!');
    });
  });
  
  it('should return a 405 response for an unsupported request method', async () => {
    const response = await request(app)
      .patch(`${config.baseUrl}/to-do/pages/0/items/0`);
    expect(response.statusCode).toBe(405);
    expect(response.type).toBe('text/plain');
    expect(response.text).toBe('Method Not Allowed');
  });
});
