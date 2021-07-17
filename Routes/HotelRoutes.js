const express = require('express');
const HotelControllers = require('../Controllers/HotelControllers');
// const { check } = require('express-validator');
const router = express.Router();


// Create a Hotel
router.post('/',  HotelControllers.createHotel);

//Get all Hotels
router.get('/', HotelControllers.getHotels);

//Get all Hotel Destinations
router.get('/destinations', HotelControllers.getHotelDestinations);

//Get Hotel by ID
router.get('/:id', HotelControllers.getHotelById);

//Update a Hotel
router.put('/:id', HotelControllers.updateHotel);

//Delete a Hotel
router.delete('/:id', HotelControllers.deleteHotel);

module.exports = router;
