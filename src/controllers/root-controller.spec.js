const request = require('supertest')
const mongoose = require('mongoose')

const config = require('../config')
const app = require('../app')

describe(`${config.baseUrl}/`, () => {
  describe('Get status', () => {
    it('should return a 200 response', async () => {
      const response = await request(app)
        .get(`${config.baseUrl}/`)
      expect(response.statusCode).toBe(200)
      expect(response.type).toBe('text/plain')
    })
  })
})
