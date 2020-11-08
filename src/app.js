require('dotenv').config()
const express = require('express')
const helmet = require("helmet")
const compression = require('compression')
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const path = require('path')
const https = require('https')
const fs = require('fs')

const config = require('./config')
const mongoServerHandler = require('./controllers/mongo-server-handler')

if (process.env.NODE_ENV != 'test') {
  mongoServerHandler.connect()
}

const app = express()
if (process.env.NODE_ENV == 'production') {
  app.use(helmet({
    contentSecurityPolicy: false,
  }))
  app.use(compression())
  app.use(morgan('combined'))
} else {
  app.use(morgan('dev'))
}
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

const apiDocsRouter = require('./routes/api-docs')
app.use(`${config.baseUrl}/api-docs`, apiDocsRouter)
const toDoRouter = require('./routes/to-do-router')
app.use(`${config.baseUrl}/to-do`, toDoRouter)

app.use((request, response, next) => {
  const error = new Error(`${request.method} ${request.url} Not Found`)
  error.status = 404
  next(error)
})

app.use((error, request, response) => {
  console.error(error)
  response.status(error.status || 500)
  response.json({error:{message:error.message}})
})

if (process.env.NODE_ENV == 'production') {
  const httpsServer = https.createServer({
    key: fs.readFileSync('certbot-keys/privkey.pem'),
    cert: fs.readFileSync('certbot-keys/fullchain.pem'),
  }, app)
  httpsServer.listen(3000, () => {
      console.log('HTTPS Server running on port 3000')
  })
}

module.exports = app
