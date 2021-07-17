const express = require ('express');
const router = express.Router();

const FeedbackControllers = require('../Controllers/FeedbackControllers')

router.post('/', FeedbackControllers.createFeedback)
router.get('/', FeedbackControllers.getFeedback)

module.exports = router;

