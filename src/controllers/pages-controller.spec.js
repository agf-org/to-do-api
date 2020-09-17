const app = require('../app');
const request = require('supertest');
const {config} = require('../config');

describe(`${config.baseUrl}/to-do/pages`, () => {
  describe('Get all pages', () => {
    it('should return a 200 response', async () => {
      const response = await request(app)
        .get(`${config.baseUrl}/to-do/pages`);
      expect(response.statusCode).toBe(200);
      expect(response.type).toBe('application/json');
    });

    it('should return a list of pages', async () => {
      const response = await request(app)
        .get(`${config.baseUrl}/to-do/pages`);
      response.body.map(page => {
        expect(typeof page.id).toBe('string');
        expect(Array.isArray(page.items)).toBe(true)
        page.items.map(item => {
          expect(typeof item.id).toBe('string');
          expect(typeof item.text).toBe('string');
          expect(typeof item.done).toBe('boolean');
        });
      });
    });
  });
  
  it('should return a 405 response for an unsupported request method', async () => {
    const response = await request(app)
      .patch(`${config.baseUrl}/to-do/pages`);
    expect(response.statusCode).toBe(405);
    expect(response.type).toBe('text/plain');
    expect(response.text).toBe('Method Not Allowed');
  });
});

