const express = require('express');
const db = require('../lib/db');

const router = express.Router();


/* GET home page. */
router.get('/', async function (req, res, next) {
  res.send('Hello there');
});

module.exports = router;
