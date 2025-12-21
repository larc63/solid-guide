var express = require('express');
var router = express.Router();
const os = require('os');
/* GET home page. */
router.get('/', function(req, res, next) {
  // res.render('index', { title: 'Express' });
  res.send(`Hello there from ${os.hostname}`);
});




module.exports = router;
