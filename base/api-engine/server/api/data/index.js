'use strict';

var express = require('express');
var controller = require('./data.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/:macAddress/:limit', auth.isAuthenticated(), controller.index);
router.post('/', auth.isAuthenticated(), controller.create);

module.exports = router;