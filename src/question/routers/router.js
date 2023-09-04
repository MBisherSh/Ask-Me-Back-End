import express from 'express';
const router = express.Router();
import AuthenticationController from '../../authentication/controllers/authentication';
import QuestionController from '../controllers/question';
import QuestionValidator from '../validators/question';
import AssetController from '../controllers/asset';
import AssetValidator from '../validators/asset';
import { catchAsync } from '../../../utils';

router.post('/', catchAsync(QuestionValidator.createQuestion), catchAsync(QuestionController.createQuestion));

router.patch(
	'/answer/is-solution',
	catchAsync(QuestionValidator.setAnswerAsASolution),
	catchAsync(QuestionController.setAnswerAsASolution)
);

router
	.route('/answer/:id')
	.post(catchAsync(QuestionValidator.deleteRateUnRateItem), catchAsync(QuestionController.rateAnswer))
	.patch(catchAsync(QuestionValidator.deleteRateUnRateItem), catchAsync(QuestionController.unRateAnswer))
	.delete(catchAsync(QuestionValidator.deleteRateUnRateItem), catchAsync(QuestionController.deleteAnswer));

router
	.route('/:id')
	.post(catchAsync(QuestionValidator.answer), catchAsync(QuestionController.answer))
	.patch(catchAsync(QuestionValidator.updateQuestion), catchAsync(QuestionController.updateQuestion))
	.delete(catchAsync(QuestionValidator.deleteRateUnRateItem), catchAsync(QuestionController.deleteQuestion));

router.use(catchAsync(AuthenticationController.restrictToAdmin));

router.get('/asset/:id', catchAsync(AssetValidator.getAssetById), catchAsync(AssetController.getAssetById));

export default router;