import { mysql, Exception, statusCodes } from '../../../utils/';

class AnswerRating {
	static async create(data) {
		let insertedUserFavorite = [[data.userId, data.answerId]];
		try {
			return await mysql.query({
				sql: 'insert into answer_rating ( userId, answerId ) values ?',
				values: [insertedUserFavorite],
			});
		} catch (e) {
			throw new Exception(statusCodes.BAD_REQUEST, e);
		}
	}

	static async delete(userId, answerId) {
		let deletedUserId;
		if (typeof userId === 'string') deletedUserId = parseInt(userId);
		else deletedUserId = userId;

		let deletedDesignId;
		if (typeof answerId === 'string') deletedDesignId = parseInt(answerId);
		else deletedDesignId = answerId;

		try {
			return await mysql.query({
				sql: 'delete from answer_rating where userId = ? and answerId = ?',
				values: [deletedUserId, deletedDesignId],
			});
		} catch (e) {
			throw new Exception(statusCodes.BAD_REQUEST, e);
		}
	}
}

export default AnswerRating;
