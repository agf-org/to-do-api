const app = require('../app');
const request = require('supertest');
const {config} = require('../config');

describe(`${config.baseUrl}/to-do/pages/0`, () => {
  describe('Get a page', () => {
    it('should return a 200 response', async () => {
      const response = await request(app)
        .get(`${config.baseUrl}/to-do/pages/0`);
      expect(response.statusCode).toBe(200);
      expect(response.type).toBe('application/json');
    });

    it('should return a page', async () => {
      const response = await request(app)
        .get(`${config.baseUrl}/to-do/pages/0`);
      expect(typeof response.body.id).toBe('string');
      expect(Array.isArray(response.body.items)).toBe(true)
    });

    it('should return a 404 response for a non-existing page', async () => {
      const response = await request(app)
        .get(`${config.baseUrl}/to-do/pages/1`);
      expect(response.statusCode).toBe(404);
      expect(response.type).toBe('text/html');
      expect(response.text).toBe('Page 1 not found!');
    });
  });
  
  describe('Delete a page', () => {
    it('should return a 200 response', async () => {
      const response = await request(app)
        .delete(`${config.baseUrl}/to-do/pages/0`);
      expect(response.statusCode).toBe(200);
      expect(response.type).toBe('text/plain');
      expect(response.text).toBe('OK');
    });

    it('should return a 404 response for a non-existing page', async () => {
      const response = await request(app)
        .delete(`${config.baseUrl}/to-do/pages/1`);
      expect(response.statusCode).toBe(404);
      expect(response.type).toBe('text/html');
      expect(response.text).toBe('Page 1 not found!');
    });
  });
  
  it('should return a 405 response for an unsupported request method', async () => {
    const response = await request(app)
      .patch(`${config.baseUrl}/to-do/pages/0`);
    expect(response.statusCode).toBe(405);
    expect(response.type).toBe('text/plain');
    expect(response.text).toBe('Method Not Allowed');
  });
});

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

  describe('Add a page', () => {
    it('should return a 201 response', async () => {
      const response = await request(app)
        .post(`${config.baseUrl}/to-do/pages`);
      expect(response.statusCode).toBe(201);
      expect(response.type).toBe('text/plain');
      expect(response.text).toBe('Created');
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

