import express from 'express';
import privateRouter from './routers/router';
import publicRouter from './routers/publicRouter';
import controller from '../authentication/controllers/authentication';
import { catchAsync } from '../../utils';

const mainRouter = express.Router();

mainRouter.use('/public', publicRouter);
mainRouter.use(catchAsync(controller.accessTokenVerifier));
mainRouter.use('/', privateRouter);

export default mainRouter;
