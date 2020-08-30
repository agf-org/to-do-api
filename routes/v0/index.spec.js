const app = require('../../app');
const request = require('supertest');

const path = '/api/v0/'

describe('positive tests for GET', () => {
  it('should return a valid 200 response', async () => {
    const response = await request(app).get(path);
    expect(response.statusCode).toBe(200);
    expect(response.type).toBe('text/plain');
    expect(response.text).toBe('OK');
  })
})

describe('negative tests for /', () => {
  it('should return a valid 405 response for unsupported request method', async () => {
    const response = await request(app).post(path);
    expect(response.statusCode).toBe(405);
    expect(response.type).toBe('text/plain');
    expect(response.text).toBe('Method Not Allowed');
  })
})
