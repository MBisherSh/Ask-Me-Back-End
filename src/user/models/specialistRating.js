import { mysql, Exception, statusCodes } from '../../../utils/';

class SpecialistRating {
	static async rate(data) {
		let insertedSpecialistRating = [[data.specialistId, data.userId,data.stars]];

		try {
			return await mysql.query({
				sql: 'insert into specialist_rating ( specialistId, userId, stars ) values ? on duplicate key update stars = VALUES(stars) ',
				values: [insertedSpecialistRating],
			});
		} catch (e) {
			throw new Exception(statusCodes.BAD_REQUEST, e);
		}
	}
}

export default SpecialistRating;
