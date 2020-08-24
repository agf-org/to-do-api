const app = require('../app');
const request = require('supertest');

describe('/ endpoint', () => {
  it('should return 200 and OK for get request method', async () => {
    const res = await request(app)
      .get('/');
    expect(res.statusCode).toEqual(200);
    expect(res.text).toEqual('OK');
  })
  
  it('should return 404 for invalid request method', async () => {
    const res = await request(app)
      .post('/');
    expect(res.statusCode).toEqual(404);
  })
})
