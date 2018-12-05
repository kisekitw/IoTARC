const express = require('express');
const controller = require('./data.controller');
const config = require('../../config/environment');
const auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/:deviceId/:limit', auth.isAuthenticated(), controller.index);
router.post('/', auth.isAuthenticated(), controller.index);

module.exports = router;

