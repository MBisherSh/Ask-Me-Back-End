import serverless from 'serverless-http';
import express from 'express';
import { Exception } from '../../utils';
import chatRouter from '../chat/mainRouter';
import cors from 'cors';
import AWS from 'aws-sdk';
import * as util from 'util';
const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json({ limit: '50mb' }));
app.use(express.text({ limit: '50mb' }));

app.use('/chat', chatRouter);

app.use(Exception.requestDefaultHandler);

export const handler = serverless(app);

const sendMessageToClient = (url, connectionId, payload) =>
	new Promise((resolve, reject) => {
		const apigatewaymanagementapi = new AWS.ApiGatewayManagementApi({
			apiVersion: '2018-11-29',
			endpoint: url,
		});
		apigatewaymanagementapi.postToConnection(
			{
				ConnectionId: connectionId, // connectionId of the receiving ws-client
				Data: JSON.stringify(payload),
			},
			(err, data) => {
				if (err) {
					console.log('err is', err);
					reject(err);
				}
				resolve(data);
			}
		);
	});
import Authentication from '../authentication/services/authentication';
import ChatService from '../chat/services/chat';
import moment from 'moment';
export const connect = async (event, context) => {
	console.log(event);

	let auth;
	if (event.headers.Authorization) {
		auth = event.headers.Authorization;
	} else if (event.queryStringParameters && event.queryStringParameters.token) {
		auth = event.queryStringParameters.token;
	} else {
		throw new Exception(401, 'please provide token.');
	}
	const user = await Authentication.verifyJwtTokenAndGetUser(auth);
	await ChatService.connect({ userId: user.id, connectionId: event.requestContext.connectionId });
	return {
		statusCode: 200,
	};
};

export const disconnect = async (event, context) => {
	console.log(event);
	//const user = await Authentication.verifyJwtTokenAndGetUser(event.headers.Authorization);
	await ChatService.disconnect(event.requestContext.connectionId);
	return {
		statusCode: 200,
	};
};

export const onMessageHandler = async (event, context) => {
	console.log(event);

	const domain = event.requestContext.domainName;
	const stage = event.requestContext.stage;
	const callbackUrlForAWS = util.format(util.format('https://%s/%s', domain, stage)); //construct the needed url
	const sender = await ChatService.getUserByConnectionId(event.requestContext.connectionId);
	let body = JSON.parse(event.body);
	const messageData = { userId: sender.userId, ...body.payload };
	const connectedTargetUser = await ChatService.getConnectionByUserId(messageData.targetUserId);
	if (connectedTargetUser.length) {
		const message = await ChatService.createMessage({ ...messageData, seenAt: moment().toISOString() });
		const sentMessage = JSON.stringify(message);
		await Promise.all(
			connectedTargetUser.map(async (user) => {
				await sendMessageToClient(callbackUrlForAWS, user.connectionId, sentMessage);
			})
		);
		await sendMessageToClient(callbackUrlForAWS, event.requestContext.connectionId, sentMessage);
	} else {
		const message = await ChatService.createMessage(messageData);
		const sentMessage = JSON.stringify(message);
		await sendMessageToClient(callbackUrlForAWS, event.requestContext.connectionId, sentMessage);
	}

	return {
		statusCode: 200,
	};
};
