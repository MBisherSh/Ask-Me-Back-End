import serverless from 'serverless-http';
import express from 'express';
import { Exception } from '../../utils';
import userRouter from '../user/mainRouter';
import cors from 'cors';
const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json({ limit: '50mb' }));
app.use(express.text({ limit: '50mb' }));

app.use('/user', userRouter);

app.use(Exception.requestDefaultHandler);

export const handler = serverless(app);
