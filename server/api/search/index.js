'use strict';

var express = require('express');
var controller = require('./search.controller');

var router = express.Router();

router.get('/test', controller.index);
module.exports = router;
