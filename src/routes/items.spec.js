const app = require('../app');
const request = require('supertest');

const basePath = '/api/items';

describe('/items', () => {
  describe('GET', () => {
    it('should return a 200 response', async () => {
      const response = await request(app)
        .get(basePath);
      expect(response.statusCode).toBe(200);
      expect(response.type).toBe('application/json');
    });

    it('should return a valid list of items', async () => {
      const response = await request(app)
        .get(basePath);
      response.body.map(item => {
        expect(typeof item.id).toBe('string');
        expect(typeof item.text).toBe('string');
        expect(typeof item.done).toBe('boolean');
      });
    });
  });

  describe('POST', () => {
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
  });
  
  it('should return a 405 response for unsupported request method', async () => {
    const response = await request(app)
      .patch(basePath);
    expect(response.statusCode).toBe(405);
    expect(response.type).toBe('text/plain');
    expect(response.text).toBe('Method Not Allowed');
  });
});

describe('/items/:id', () => {
  describe('GET', () => {
    it('should return a 200 response', async () => {
      const response = await request(app)
        .get(`${basePath}/0`);
      expect(response.statusCode).toBe(200);
      expect(response.type).toBe('application/json');
    });

    it('should return a valid item', async () => {
      const response = await request(app)
        .get(`${basePath}/0`);
      expect(typeof response.body.id).toBe('string');
      expect(typeof response.body.text).toBe('string');
      expect(typeof response.body.done).toBe('boolean');
    });

    it('should return a 404 response for a non-existing item', async () => {
      const response = await request(app)
        .get(`${basePath}/1`);
      expect(response.statusCode).toBe(404);
      expect(response.type).toBe('text/plain');
      expect(response.text).toBe('Not Found');
    });
  });

  describe('PUT', () => {
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

    it('should return a 404 response for a non-existing item', async () => {
      const response = await request(app)
        .put(`${basePath}/1`)
        .send({
          "text": "test",
          "done": false
        });
      expect(response.statusCode).toBe(404);
      expect(response.type).toBe('text/plain');
      expect(response.text).toBe('Not Found');
    });
  });
  
  describe('DELETE', () => {
    it('should return a 200 response', async () => {
      const response = await request(app)
        .delete(`${basePath}/0`);
      expect(response.statusCode).toBe(200);
      expect(response.type).toBe('text/plain');
      expect(response.text).toBe('OK');
    });

    it('should return a 404 response for a non-existing item', async () => {
      const response = await request(app)
        .get(`${basePath}/1`);
      expect(response.statusCode).toBe(404);
      expect(response.type).toBe('text/plain');
      expect(response.text).toBe('Not Found');
    });
  });
  
  it('should return a 405 response for unsupported request method', async () => {
    const response = await request(app)
      .patch(`${basePath}/0`);
    expect(response.statusCode).toBe(405);
    expect(response.type).toBe('text/plain');
    expect(response.text).toBe('Method Not Allowed');
  });
});
