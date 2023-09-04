import express from 'express';
import { catchAsync } from '../../../utils';
import QuestionController from '../controllers/question';
import QuestionValidator from '../validators/question';
const router = express.Router();

router.get('/', catchAsync(QuestionValidator.getQuestion), catchAsync(QuestionController.getQuestion));
router.get('/answer', catchAsync(QuestionValidator.getAnswers), catchAsync(QuestionController.getAnswers));
router.get('/:id', catchAsync(QuestionValidator.getQuestionById), catchAsync(QuestionController.getQuestionById));

export default router;
