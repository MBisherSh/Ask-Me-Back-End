import { mysql, Exception, statusCodes } from '../../../utils/';

class Answer {
	static async create(data) {
		let insertedAnswer = [[data.answer, data.questionId, data.userId]];

		try {
			return await mysql.query({
				sql: 'insert into answer ( answer, questionId, userId ) values ?',
				values: [insertedAnswer],
			});
		} catch (e) {
			throw new Exception(statusCodes.BAD_REQUEST, e);
		}
	}

	static async getById(id, filters) {
		let columns =
			'a.id, a.answer, a.createdAt, a.questionId, a.isSolution, q.subject as questionSubject, ' +
			'u.id as userId, u.name as userName, u.phone as userPhone, u.email as userEmail, ' +
			"concat('https://ask-me-assets-public.s3.us-east-2.amazonaws.com/',ua.key) as userProfileImageUrl, " +
			'count(arc.userId) as rating ';
		let join =
			'inner join question as q on q.id = a.questionId ' +
			'inner join user as u on u.id = a.userId ' +
			'left join asset as ua on ua.id = u.profileImageId ' +
			'left join answer_rating as arc on arc.answerId = a.id ';
		if (filters.userId) {
			columns = columns.concat(', ar.userId as isRated ');
			join = join.concat(`left join answer_rating as ar on ar.userId = u.id and ar.answerId = a.id `);
		}
		let groupBy = 'group by a.id ';
		let sql = `select ${columns} from answer a ${join} where a.id = ? ${groupBy} limit 1`;
		try {
			let result = await mysql.query({
				sql,
				values: [id],
			});
			if (result.length > 0) return result[0];
			else return null;
		} catch (e) {
			throw new Exception(statusCodes.BAD_REQUEST, e);
		}
	}

	static async get(filters) {
		const sqlValues = [];
		const countValues = [];

		let columns =
			'a.id, a.answer, a.createdAt, a.questionId, a.isSolution, q.subject as questionSubject, ' +
			'u.id as userId, u.name as userName, u.phone as userPhone, u.email as userEmail, ' +
			"concat('https://ask-me-assets-public.s3.us-east-2.amazonaws.com/',ua.key) as userProfileImageUrl, " +
			'count(arc.userId) as rating ';
		let join =
			'inner join question as q on q.id = a.questionId ' +
			'inner join user as u on u.id = a.userId ' +
			'left join asset as ua on ua.id = u.profileImageId ';

		let where = '';

		if (filters.questionId) {
			where = 'where a.questionId = ? ';
			sqlValues.push(filters.questionId);
			countValues.push(filters.questionId);
		}

		if (filters.userId) {
			columns = columns.concat(', ar.userId as isRated ');
			join = join.concat(`left join answer_rating as ar on ar.userId = ${filters.userId} and ar.answerId = a.id `);
			if (filters.myAnswers) {
				where = where === '' ? 'where a.userId = ? ' : where.concat('and a.userId = ? ');
				sqlValues.push(filters.userId);
				countValues.push(filters.userId);
			}
		}

		let sqlJoin = join.concat('left join answer_rating as arc on arc.answerId = a.id ');

		let groupBy = 'group by a.id ';
		let order = 'order by rating desc, a.id desc ';
		let pagination = 'limit ?, ? ';
		sqlValues.push(filters.offset);
		sqlValues.push(filters.limit);

		let select = 'select ';
		let sql = select.concat(columns, 'from answer a ', sqlJoin, where, groupBy, order, pagination);
		let countBase = 'select count(a.id) as total from answer as a ';
		const countSql = countBase.concat(join, where);
		try {
			let result = {};
			if (filters.offset === 0) {
				result.total = (
					await mysql.query({
						sql: countSql,
						values: countValues,
					})
				)[0].total;
			}
			result.data = await mysql.query({
				sql,
				values: sqlValues,
			});
			return result;
		} catch (e) {
			throw new Exception(statusCodes.BAD_REQUEST, e);
		}
	}

	static async delete(id) {
		try {
			return await mysql.query({ sql: 'delete from answer where id = ?', values: [id] });
		} catch (e) {
			throw new Exception(statusCodes.BAD_REQUEST, e);
		}
	}

	static async update(id, data) {
		try {
			return await mysql.query({ sql: 'update answer set ? where id = ?', values: [data, id] });
		} catch (e) {
			throw new Exception(statusCodes.BAD_REQUEST, e);
		}
	}
}

export default Answer;
