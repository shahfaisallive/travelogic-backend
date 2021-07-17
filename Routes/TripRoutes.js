const express = require ('express');
const router = express.Router();

const TripControllers = require('../Controllers/TripControllers');
const { auth } = require('../middleware/auth');

router.post('/', TripControllers.createTrip)

router.put('/:id',TripControllers.updateTripById)

router.put('/upload/image', TripControllers.uploadTripPhoto,TripControllers.addImagetoTrip)

router.route('/').get(TripControllers.getTrips)

router.get('/admin', TripControllers.getTripsAdmin)

router.get('/:id', TripControllers.getTripbyId)

router.delete('/:id', TripControllers.deleteTripById)

router.post('/:id/reviews', auth, TripControllers.createTripReview)

module.exports = router
