import ChatService from '../services/chat';
import { statusCodes } from '../../../utils';

const getConsultancyList = async (req, res) => {
	const filters = req.query;
	filters.userId = req.user.id;
	const result = await ChatService.getConsultancyList(filters);
	res.status(statusCodes.OK).json(result);
};
const getMessageList = async (req, res) => {
	const filters = req.query;
	const userId = req.user.id;
	const result = await ChatService.getMessageList(userId, filters);
	res.status(statusCodes.OK).json(result);
};

const getConsultancyByTwoUserIds = async (req, res) => {
	const secondUserId = req.params.id;
	const userId = req.user.id;
	const result = await ChatService.getConsultancyByTwoUserIds(userId, secondUserId);
	res.status(statusCodes.OK).json({ consultancy: result });
};

const getUnseenList = async (req, res) => {
	const userId = req.user.id;
	const result = await ChatService.getUnseenList(userId);
	res.status(statusCodes.OK).json(result);
};

export default {
	getMessageList,
	getConsultancyList,
	getUnseenList,
	getConsultancyByTwoUserIds,
};
