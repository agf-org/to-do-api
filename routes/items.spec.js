const app = require('../app');
const request = require('supertest');

describe('positive tests for GET /items', () => {
  it('should return a valid 200 response', async () => {
    const response = await request(app).get('/items');
    expect(response.statusCode).toBe(200);
    expect(response.type).toBe('application/json');
  })

  it('should return a valid list of items', async () => {
    const response = await request(app).get('/items');
    response.body.map(item => {
      expect(typeof item.id).toBe('number');
      expect(typeof item.text).toBe('string');
      expect(typeof item.done).toBe('boolean');
    })
  })
})

describe('negative tests for /items', () => {
  it('should return a valid 405 response for unsupported request method', async () => {
    const response = await request(app).post('/items');
    expect(response.statusCode).toBe(405);
    expect(response.type).toBe('text/plain');
    expect(response.text).toBe('Method Not Allowed');
  })
})
