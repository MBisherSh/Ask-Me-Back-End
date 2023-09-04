import { mysql, Exception, statusCodes } from '../../../utils/';

class UserFavorite {
	static async create(data) {
		let insertedUserFavorite = [[data.userId, data.questionId]];
		try {
			return await mysql.query({
				sql: 'insert into user_favorite ( userId, questionId ) values ?',
				values: [insertedUserFavorite],
			});
		} catch (e) {
			throw new Exception(statusCodes.BAD_REQUEST, e);
		}
	}

	static async delete(userId, questionId) {
		let deletedUserId;
		if (typeof userId === 'string') deletedUserId = parseInt(userId);
		else deletedUserId = userId;

		let deletedDesignId;
		if (typeof questionId === 'string') deletedDesignId = parseInt(questionId);
		else deletedDesignId = questionId;

		try {
			return await mysql.query({
				sql: 'delete from user_favorite where userId = ? and questionId = ?',
				values: [deletedUserId, deletedDesignId],
			});
		} catch (e) {
			throw new Exception(statusCodes.BAD_REQUEST, e);
		}
	}
}

export default UserFavorite;
