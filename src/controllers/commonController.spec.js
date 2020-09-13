const app = require('../app');
const request = require('supertest');
const {config} = require('../config');

const basePath = config.baseUrl;

describe('/', () => {
  describe('GET', () => {
    it('should return a 200 response', async () => {
      const response = await request(app).get(basePath);
      expect(response.statusCode).toBe(200);
      expect(response.type).toBe('text/plain');
      expect(response.text).toBe('OK');
    });
  });

  it('should return a 405 response for unsupported request method', async () => {
    const response = await request(app).post(basePath);
    expect(response.statusCode).toBe(405);
    expect(response.type).toBe('text/plain');
    expect(response.text).toBe('Method Not Allowed');
  });
});
