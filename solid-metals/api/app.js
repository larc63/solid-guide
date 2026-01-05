const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

const getQuotes = require('./src/goldapi');
const { exit } = require('process');

if(typeof process.env.AU_API_TOKEN !== 'string') {
  console.error('no au auth token');
  exit(1);
}

console.log(`au token: ${process.env.AU_API_TOKEN}`);

const app = express();

// view engine setup
app.use(cors());
app.use(logger('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/prices', async (req, res) => {
  const o = await getQuotes();
  res.json(o);
});

app.use((req, res, next) => {
  res.status(404).send("Resource not found.");
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
});

process.on('SIGTERM', async () => {
  console.log('SIGTERM received, closing server...');
  process.exit(0);
});

module.exports = app;
