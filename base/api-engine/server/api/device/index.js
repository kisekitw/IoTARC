const express = require('express');
const controller = require('./device.controller');
const config = require('../../config/environment');
const auth = require('../../auth/auth.service');

const router = express.Router();

//TODO: Get all devices
router.get('/', auth.isAuthenticated(), controller.index);

//TODO: Delete a device
router.delete('/:id', auth.isAuthenticated(), controller.destroy); 

//TODO: Update a device
router.put('/:id', auth.isAuthenticated(), controller.update);

//TODO: Get one device
router.get('/:id', auth.isAuthenticated(), controller.show);

//TODO: Create a device
router.post('/', auth.isAuthenticated(), controller.create);

module.exports = router;