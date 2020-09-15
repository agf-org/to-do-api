const app = require('../app');
const request = require('supertest');
const {config} = require('../config');

const basePath = `${config.baseUrl}/to-do/pages/0/items`;

describe(`${basePath} tests`, () => {
  describe('GET tests', () => {
    it('should return a 200 response', async () => {
      const response = await request(app)
        .get(basePath);
      expect(response.statusCode).toBe(200);
      expect(response.type).toBe('application/json');
    });

    it('should return a list of items', async () => {
      const response = await request(app)
        .get(basePath);
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

  describe('POST tests', () => {
    it('should return a 201 response', async () => {
      const response = await request(app)
        .post(basePath)
        .send({
          "text": "test",
          "done": false
        });
      expect(response.statusCode).toBe(201);
      expect(response.type).toBe('text/plain');
      expect(response.text).toBe('Created');
    });

    it('should return a 400 response for an item without text field', async () => {
      const response = await request(app)
        .post(basePath)
        .send({
          "done": false
        });
      expect(response.statusCode).toBe(400);
      expect(response.type).toBe('text/plain');
      expect(response.text).toBe('Bad Request');
    });

    it('should return a 400 response for an item without done field', async () => {
      const response = await request(app)
        .post(basePath)
        .send({
          "text": "test"
        });
      expect(response.statusCode).toBe(400);
      expect(response.type).toBe('text/plain');
      expect(response.text).toBe('Bad Request');
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
      .patch(basePath);
    expect(response.statusCode).toBe(405);
    expect(response.type).toBe('text/plain');
    expect(response.text).toBe('Method Not Allowed');
  });
});

describe(`${basePath}/:id`, () => {
  describe('GET tests', () => {
    it('should return a 200 response', async () => {
      const response = await request(app)
        .get(`${basePath}/0`);
      expect(response.statusCode).toBe(200);
      expect(response.type).toBe('application/json');
    });

    it('should return an item', async () => {
      const response = await request(app)
        .get(`${basePath}/0`);
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
        .get(`${basePath}/1`);
      expect(response.statusCode).toBe(404);
      expect(response.type).toBe('text/html');
      expect(response.text).toBe('Item 1 not found!');
    });
  });

  describe('PUT tests', () => {
    it('should return a 200 response', async () => {
      const response = await request(app)
        .put(`${basePath}/0`)
        .send({
          "text": "test",
          "done": false
        });
      expect(response.statusCode).toBe(200);
      expect(response.type).toBe('text/plain');
      expect(response.text).toBe('OK');
    });

    it('should return a 400 response for an item without text field', async () => {
      const response = await request(app)
      .put(`${basePath}/0`)
        .send({
          "done": false
        });
      expect(response.statusCode).toBe(400);
      expect(response.type).toBe('text/plain');
      expect(response.text).toBe('Bad Request');
    });

    it('should return a 400 response for an item without done field', async () => {
      const response = await request(app)
      .put(`${basePath}/0`)
        .send({
          "text": "test"
        });
      expect(response.statusCode).toBe(400);
      expect(response.type).toBe('text/plain');
      expect(response.text).toBe('Bad Request');
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
        .put(`${basePath}/1`)
        .send({
          "text": "test",
          "done": false
        });
      expect(response.statusCode).toBe(404);
      expect(response.type).toBe('text/html');
      expect(response.text).toBe('Item 1 not found!');
    });
  });
  
  describe('DELETE tests', () => {
    it('should return a 200 response', async () => {
      const response = await request(app)
        .delete(`${basePath}/0`);
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
        .delete(`${basePath}/1`);
      expect(response.statusCode).toBe(404);
      expect(response.type).toBe('text/html');
      expect(response.text).toBe('Item 1 not found!');
    });
  });
  
  it('should return a 405 response for an unsupported request method', async () => {
    const response = await request(app)
      .patch(`${basePath}/0`);
    expect(response.statusCode).toBe(405);
    expect(response.type).toBe('text/plain');
    expect(response.text).toBe('Method Not Allowed');
  });
});
