const app = require('../../app');
const request = require('supertest');

const path = '/api/v0/items'

describe('positive tests for GET', () => {
  it('should return a valid 200 response', async () => {
    const response = await request(app).get(path);
    expect(response.statusCode).toBe(200);
    expect(response.type).toBe('application/json');
  })

  it('should return a valid list of items', async () => {
    const response = await request(app).get(path);
    response.body.map(item => {
      expect(typeof item.id).toBe('number');
      expect(typeof item.text).toBe('string');
      expect(typeof item.done).toBe('boolean');
    })
  })
})

describe('negative tests', () => {
  it('should return a valid 405 response for unsupported request method', async () => {
    const response = await request(app).post(path);
    expect(response.statusCode).toBe(405);
    expect(response.type).toBe('text/plain');
    expect(response.text).toBe('Method Not Allowed');
  })
})
