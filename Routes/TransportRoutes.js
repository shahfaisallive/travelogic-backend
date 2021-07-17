const express = require('express');
const TransportControllers = require('../Controllers/TransportControllers');
const { check } = require('express-validator');
const router = express.Router();

// Create a Transport
router.post('/', TransportControllers.createTransport);

//Get all Transports
router.get('/', TransportControllers.getTransports);

//Get Transport by ID
router.get('/:id', TransportControllers.getTransportById);

//Update a Transport
router.put('/:id', check('fare').isLength({min: 2, max: 5}), TransportControllers.updateTransport);

//Delete a Transport
router.delete('/:id', TransportControllers.deleteTransportById);

module.exports = router;
