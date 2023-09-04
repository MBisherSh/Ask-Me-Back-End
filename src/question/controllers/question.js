import QuestionService from '../services/question';
import { statusCodes } from '../../../utils';

const getQuestion = async (req, res) => {
	const filters = req.query;
	const result = await QuestionService.get(filters);
	res.status(statusCodes.OK).json(result);
};

const getQuestionById = async (req, res) => {
	const filters = req.query;
	const id = req.params.id;
	const result = await QuestionService.getById(id, filters);
	res.status(statusCodes.OK).json(result);
};

const createQuestion = async (req, res) => {
	const data = req.body;
	data.userId = req.user.id;
	const result = await new QuestionService(data).create();
	res.status(statusCodes.CREATED).json(result);
};

const updateQuestion = async (req, res) => {
	const id = req.params.id;
	const data = req.body;
	const user = req.user;
	const result = await QuestionService.update(id, data, user);
	res.status(statusCodes.UPDATED).json(result);
};

const deleteQuestion = async (req, res) => {
	const id = req.params.id;
	const user = req.user;
	const result = await QuestionService.delete(id, user);
	res.status(statusCodes.DELETED).json(result);
};

const answer = async (req, res) => {
	const data = req.body;
	const id = req.params.id;
	const userId = req.user.id;
	const result = await QuestionService.answer(id, userId, data);
	res.status(statusCodes.CREATED).json(result);
};

const getAnswers = async (req, res) => {
	const filters = req.query;
	const result = await QuestionService.getAnswers(filters);
	res.status(statusCodes.OK).json(result);
};

const deleteAnswer = async (req, res) => {
	const id = req.params.id;
	const user = req.user;
	const result = await QuestionService.deleteAnswer(id, user);
	res.status(statusCodes.DELETED).json(result);
};

const rateAnswer = async (req, res) => {
	const answerId = req.params.id;
	const userId = req.user.id;
	const result = await QuestionService.rateAnswer(answerId, userId);
	res.status(statusCodes.CREATED).json(result);
};

const unRateAnswer = async (req, res) => {
	const answerId = req.params.id;
	const userId = req.user.id;
	const result = await QuestionService.unRateAnswer(answerId, userId);
	res.status(statusCodes.DELETED).json(result);
};

const setAnswerAsASolution = async (req, res) => {
	const data = req.body;
	const user = req.user;
	const result = await QuestionService.setAnswerAsASolution(data, user);
	res.status(statusCodes.UPDATED).json(result);
};

export default {
	getQuestion,
	getQuestionById,
	createQuestion,
	updateQuestion,
	deleteQuestion,
	answer,
	getAnswers,
	deleteAnswer,
	rateAnswer,
	unRateAnswer,
	setAnswerAsASolution,
};
