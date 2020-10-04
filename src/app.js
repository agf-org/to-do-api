require('dotenv').config()
const express = require('express')
const helmet = require("helmet")
const compression = require('compression')
const morgan = require('morgan')
const rfs = require('rotating-file-stream')
const cookieParser = require('cookie-parser')
const path = require('path')

const config = require('./config')
const mongoMemoryServerHandler = require('./controllers/mongo-memory-server-handler')
const mongoServerHandler = require('./controllers/mongo-server-handler')

if (process.env.NODE_ENV != 'test') {
  if (process.env.NODE_ENV == 'local') {
    mongoMemoryServerHandler.connect()
  } else {
    mongoServerHandler.connect()
  }
}

const app = express()
if (process.env.NODE_ENV == 'production') {
  app.use(helmet())
  app.use(compression())
  const accessLogStream = rfs.createStream(
    'access.log', 
    {
      interval: '1d',
      path: path.join('logs')
    }
  )
  app.use(morgan('combined', {stream: accessLogStream}))
} else {
  app.use(morgan('dev'))
}
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

if (process.env.NODE_ENV != 'production') {
  const apiDocsRouter = require('./routes/api-docs')
  app.use(`${config.baseUrl}/api-docs`, apiDocsRouter)
}
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

module.exports = app
