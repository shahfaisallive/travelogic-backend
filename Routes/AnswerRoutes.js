const express = require ('express');
const router = express.Router();
const { protectAdmin } = require('../middleware/auth')


const AnswerControllers = require('../Controllers/AnswerControllers')

router.post('/', AnswerControllers.createAnswer)
router.get('/', AnswerControllers.getAnswers)
router.get('/admin', AnswerControllers.getAnswersAdmin)
router.get('/questions/:id', AnswerControllers.getAnswersByQuestionId)
router.get('/reported', AnswerControllers.getReportedAnswersAdmin)
router.delete('/:id',AnswerControllers.deleteAnswerbyId )
router.put('/:id', AnswerControllers.updateAnswerbyId)
router.put('report/:id', AnswerControllers.reportAnswer)

module.exports = router;
