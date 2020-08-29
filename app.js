const express = require('express');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const path = require('path');

const indexRouter = require('./routes/index');
const apiDocsRouter = require('./routes/api-docs');
const itemsRouter = require('./routes/items');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api-docs', apiDocsRouter);
app.use('/items', itemsRouter);

app.use((request, response, next) => {
  const error = new Error(`${request.method} ${request.url} Not Found`);
  error.status = 404;
  next(error);
});

app.use((error, request, response) => {
  console.error(error);
  response.status(error.status || 500);
  response.json({error:{message:error.message}});
});

module.exports = app;
