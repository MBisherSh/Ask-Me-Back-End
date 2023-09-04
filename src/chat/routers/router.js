import express from 'express';
const router = express.Router();
import ChatController from '../controllers/chat';
import ChatValidator from '../validators/chat';
import AuthenticationController from '../../authentication/controllers/authentication';
import { catchAsync } from '../../../utils';

router.get('/consultancy', catchAsync(ChatValidator.getConsultancyList), catchAsync(ChatController.getConsultancyList));
router.get(
	'/consultancy/:id',
	catchAsync(ChatValidator.getConsultancyByTwoUserIds),
	catchAsync(ChatController.getConsultancyByTwoUserIds)
);
router.get('/message', catchAsync(ChatValidator.getMessageList), catchAsync(ChatController.getMessageList));
router.get('/message/unseen', catchAsync(ChatController.getUnseenList));

router.use(catchAsync(AuthenticationController.restrictToAdmin));

export default router;
