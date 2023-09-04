import ConnectedUser from '../models/connectedUser';
import Consultancy from '../models/consultancy';
import Message from '../models/message';
import { statusCodes, Exception } from '../../../utils';
class ChatService {
	static async connect(data) {
		await ConnectedUser.create(data);
		return { msg: 'CONNECTED', data };
	}

	static async disconnect(connectionId) {
		await ConnectedUser.delete(connectionId);
		return { msg: 'DISCONNECTED', connectionId };
	}

	static async createConsultancy(data) {
		const consultancy = await Consultancy.create(data);
		return { msg: `A consultancy has been created.`, data: { id: consultancy.insertId, ...data } };
	}

	static async getConsultancyList(filters) {
		return await Consultancy.get({
			limit: parseInt(filters.limit),
			offset: parseInt(filters.offset),
			userId: parseInt(filters.userId),
		});
	}
	static async getConsultancyByTwoUserIds(firstUserId, secondUserId) {
		return await Consultancy.getByTwoUserIds(firstUserId, secondUserId);
	}

	static async getConnectionByUserId(userId) {
		return await ConnectedUser.getByUserId(userId);
	}

	static async getUserByConnectionId(connectionId) {
		return await ConnectedUser.getByConnectionId(connectionId);
	}

	static async createMessageDirect(data) {
		const message = await Message.create(data);
		return { msg: `A message has been created.`, data: { id: message.insertId, ...data } };
	}

	static async createMessage(data) {
		const { userId, targetUserId, content, seenAt } = data;
		const consultancy = await Consultancy.getByTwoUserIds(userId, targetUserId);
		let consultancyId = consultancy
			? consultancy.id
			: (await ChatService.createConsultancy({ firstUserId: userId, secondUserId: targetUserId })).data.id;
		const messageData = { senderId: userId, consultancyId, content, seenAt };
		const message = (await ChatService.createMessageDirect(messageData)).data;
		return { id: message.id, ...messageData };
	}

	static async getMessageList(userId, filters) {
		const consultancy = await Consultancy.getById(filters.consultancyId);
		if (!consultancy || (consultancy.firstUserId != userId && consultancy.secondUserId != userId))
			throw new Exception(statusCodes.BAD_REQUEST, 'no such allowed consultancy');
		return await Message.get({
			limit: parseInt(filters.limit),
			offset: parseInt(filters.offset),
			consultancyId: parseInt(filters.consultancyId),
			content: filters.content,
		});
	}

	static async getUnseenList(userId) {
		const messages = await Message.getUnseen(userId);
		if (messages.data.length) {
			let ids = [];
			messages.data.map((message) => {
				ids.push(message.id);
			});
			await Message.seeMessage(ids);
		}
		return messages;
	}
}

export default ChatService;
