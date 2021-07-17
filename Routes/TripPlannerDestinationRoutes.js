const express = require ('express');
const router = express.Router();

const TripPlannerDestinationControllers = require('../Controllers/TripPlannerDestinationController')

router.post('/', TripPlannerDestinationControllers.createTripPlannerDestination )
router.get('/', TripPlannerDestinationControllers.getAllTripPlannerDestinations )
router.get('/:id', TripPlannerDestinationControllers.getTripPlannerDestionationById )
router.post('/coordinates/destinations', TripPlannerDestinationControllers.getTripPlannerDestinationByCoordinates )
router.post('/id/destinations', TripPlannerDestinationControllers.getTripPlannerDestinationById )
router.delete('/:id', TripPlannerDestinationControllers.deleteTripPlannerDestinationById )

module.exports = router;
