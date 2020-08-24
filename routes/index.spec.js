const app = require('../app');
const request = require('supertest');

describe('/ endpoint', () => {
  it('should return the list of items', async () => {
    const res = await request(app)
      .get('/');
    expect(res.statusCode).toEqual(200);
    expect(res.text).toEqual('OK');
  })
})
