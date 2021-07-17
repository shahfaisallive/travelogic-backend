const express = require ('express');
const router = express.Router();

const PlanATripControllers = require('../Controllers/PlanATripController')

router.post('/estimate', PlanATripControllers.getTripPlanEstimate )

module.exports = router;
