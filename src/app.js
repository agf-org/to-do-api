require('dotenv').config()
const express = require('express')
const helmet = require("helmet")
const compression = require('compression')
const morgan = require('morgan')
const rfs = require('rotating-file-stream')
const cookieParser = require('cookie-parser')
const path = require('path')
const mongoose = require('mongoose')

const config = require('./config')

const app = express()
// app.use(helmet())
app.use(compression())
if (process.env.NODE_ENV == 'production') {
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

if (process.env.NODE_ENV != 'test') {
  const mongoUri = `mongodb://${process.env.MONGODB_HOST}:${process.env.MONGODB_PORT}/${process.env.MONGODB_DATABASE}`
  const mongooseOpts = {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
  mongoose.connect(mongoUri, mongooseOpts)
}

const apiDocsRouter = require('./routes/api-docs')
const toDoRouter = require('./routes/to-do-router')
app.use(`${config.baseUrl}/api-docs`, apiDocsRouter)
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
