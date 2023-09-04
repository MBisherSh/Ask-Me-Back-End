import express from 'express';
import controller from '../controllers/authentication';
import { catchAsync } from '../../../utils';
import validator from '../validators/authentication';

const router = express.Router();

router.post('/request-verification', catchAsync(controller.requestVerificationCode));
router.post('/verify', catchAsync(validator.verify), catchAsync(controller.verifyAccount));

router.post('/change-password', catchAsync(validator.changePassword), catchAsync(controller.changePassword));

export default router;
