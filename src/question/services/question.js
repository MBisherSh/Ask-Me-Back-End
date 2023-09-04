import Question from '../models/question';
import Answer from '../models/answer';
import AnswerRating from '../models/answerRating';
import { Exception, statusCodes } from '../../../utils';

class QuestionService {
	constructor(data) {
		this.subject = data.subject;
		this.question = data.question;
		this.fieldId = data.fieldId;
		this.userId = data.userId;
	}
	async create() {
		const result = await this.save();
		return { msg: `A question has been created.`, data: { id: result.insertId, question: this } };
	}

	async save() {
		return await Question.create(this);
	}

	static async get(filters) {
		return await Question.get({
			limit: parseInt(filters.limit),
			offset: parseInt(filters.offset),
			subject: filters.subject,
			userId: filters.userId ? parseInt(filters.userId) : undefined,
			fieldId: filters.fieldId ? parseInt(filters.fieldId) : undefined,
			isFavorite: filters.isFavorite === 'true' || filters.isFavorite === true ? true : undefined,
			myQuestions: filters.myQuestions === 'true' || filters.myQuestions === true ? true : undefined,
		});
	}

	static async getById(id, filters) {
		const question = await Question.getById(id, filters);
		if (!question) throw new Exception(statusCodes.ITEM_NOT_FOUND, 'no such question');
		return question;
	}

	static async update(id, data, user) {
		const question = await Question.getById(id, {});
		if (user.role < 3 && (!question || question.userId != user.id))
			throw new Exception(statusCodes.UNAUTHORIZED, 'you are not allowed to do this');
		await Question.update(id, data);
		return { msg: `question has been updated.`, data: { id, updatedData: data } };
	}

	static async delete(id, user) {
		const question = await Question.getById(id, {});
		if (user.role < 3 && (!question || question.userId !== user.id))
			throw new Exception(statusCodes.UNAUTHORIZED, 'you are not allowed to do this');
		let deletedId;
		if (typeof id === 'string') deletedId = parseInt(id);
		else deletedId = id;
		return await Question.delete(deletedId);
	}

	static async answer(questionId, userId, data) {
		const result = await Answer.create({ questionId, userId, answer: data.answer });
		return { msg: `answer has been created.`, data: { id: result.insertId, answer: data.answer } };
	}

	static async getAnswers(filters) {
		return await Answer.get({
			limit: parseInt(filters.limit),
			offset: parseInt(filters.offset),
			userId: filters.userId ? parseInt(filters.userId) : undefined,
			questionId: filters.questionId ? parseInt(filters.questionId) : undefined,
			myAnswers: filters.myAnswers === 'true' || filters.myAnswers === true ? true : undefined,
		});
	}

	static async deleteAnswer(id, user) {
		const answer = await Answer.getById(id, {});
		if (user.role < 3 && (!answer || answer.userId !== user.id))
			throw new Exception(statusCodes.UNAUTHORIZED, 'you are not allowed to do this');
		const deletedId = typeof id === 'string' ? parseInt(id) : id;
		return await Answer.delete(deletedId);
	}

	static async rateAnswer(answerId, userId) {
		await AnswerRating.create({ answerId, userId });
		return { msg: `answer has been rated.`, data: { id: answerId } };
	}

	static async unRateAnswer(answerId, userId) {
		await AnswerRating.delete(userId, answerId);
		return { msg: `answer has been unRated.`, data: { id: answerId } };
	}

	static async setAnswerAsASolution({ answerId, isSolution }, user) {
		const answer = await Answer.getById(answerId, {});
		if (!answer) throw new Exception(statusCodes.ITEM_NOT_FOUND, 'no such answer');
		const question = await Question.getById(answer.questionId, {});
		if (user.role < 3 && (!question || question.userId !== user.id))
			throw new Exception(statusCodes.UNAUTHORIZED, 'you are not allowed to do this');
		await Answer.update(answerId, { isSolution });
		return { msg: `answer has been updated.`, data: { id: answerId } };
	}
}

export default QuestionService;
