const app = require('../app');
const request = require('supertest');

const basePath = '/api/items';

describe('/items', () => {
  describe('GET', () => {
    it('should return a valid 200 response', async () => {
      const response = await request(app).get(basePath);
      expect(response.statusCode).toBe(200);
      expect(response.type).toBe('application/json');
    });

    it('should return a valid list of items', async () => {
      const response = await request(app).get(basePath);
      response.body.map(item => {
        expect(typeof item.id).toBe('number');
        expect(typeof item.text).toBe('string');
        expect(typeof item.done).toBe('boolean');
      });
    });
  });
  
  it('should return a valid 405 response for unsupported request method', async () => {
    const response = await request(app).post(basePath);
    expect(response.statusCode).toBe(405);
    expect(response.type).toBe('text/plain');
    expect(response.text).toBe('Method Not Allowed');
  });
});

describe('/items/:id', () => {
  describe('GET', () => {
    it('should return a valid 200 response', async () => {
      const response = await request(app).get(`${basePath}/0`);
      expect(response.statusCode).toBe(200);
      expect(response.type).toBe('application/json');
    });

    it('should return a valid item', async () => {
      const response = await request(app).get(`${basePath}/0`);
      expect(typeof response.body.id).toBe('number');
      expect(typeof response.body.text).toBe('string');
      expect(typeof response.body.done).toBe('boolean');
    });

    it('should return a valid 404 response for a non-existing item', async () => {
      const response = await request(app).get(`${basePath}/1`);
      expect(response.statusCode).toBe(404);
      expect(response.type).toBe('text/plain');
      expect(response.text).toBe('Not Found');
    });
  });
  
  it('should return a valid 405 response for unsupported request method', async () => {
    const response = await request(app).patch(`${basePath}/0`);
    expect(response.statusCode).toBe(405);
    expect(response.type).toBe('text/plain');
    expect(response.text).toBe('Method Not Allowed');
  });
});
