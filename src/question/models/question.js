import { mysql, Exception, statusCodes } from '../../../utils/';

class Question {
	static async create(data) {
		let insertedQuestion = [[data.subject, data.question, data.fieldId, data.userId]];

		try {
			return await mysql.query({
				sql: 'insert into question ( subject, question, fieldId, userId ) values ?',
				values: [insertedQuestion],
			});
		} catch (e) {
			throw new Exception(statusCodes.BAD_REQUEST, e);
		}
	}

	static async getById(id, filters) {
		let columns =
			'q.id, q.subject, q.question, q.createdAt, q.fieldId, f.nameAr as fieldNameAr, f.nameEn as fieldNameEn,' +
			'u.id as userId, u.name as userName, u.phone as userPhone, u.email as userEmail, ' +
			"concat('https://ask-me-assets-public.s3.us-east-2.amazonaws.com/',ua.key) as userProfileImageUrl ";
		let join =
			'left join field as f on f.id = q.fieldId ' +
			'inner join user as u on u.id = q.userId ' +
			'left join asset as ua on ua.id = u.profileImageId ';
		if (filters.userId) {
			columns = columns.concat(', uf.userId as isFavorite ');
			join = join.concat(`left join user_favorite as uf on uf.userId = u.id and uf.questionId = q.id `);
		}
		let sql = `select ${columns} from question q  ${join} where q.id = ? limit 1`;
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
			'q.id, q.subject, q.question, q.createdAt, ' +
			'f.nameAr as fieldNameAr, f.nameEn as fieldNameEn, u.name as userName, ' +
			"concat('https://ask-me-assets-public.s3.us-east-2.amazonaws.com/',ua.key) as userProfileImageUrl ";
		let join =
			'left join field as f on f.id = q.fieldId ' +
			'inner join user as u on u.id = q.userId ' +
			'left join asset as ua on ua.id = u.profileImageId ';

		let where = '';

		if (filters.subject) {
			where = 'where ( q.subject like ? or q.subject like ? ) ';
			sqlValues.push(`%${filters.subject}%`);
			sqlValues.push(`%${filters.subject}%`);
			countValues.push(`%${filters.subject}%`);
			countValues.push(`%${filters.subject}%`);
		}

		if (filters.userId) {
			columns = columns.concat(', uf.userId as isFavorite ');
			let joinType = filters.isFavorite ? 'inner' : 'left';
			join = join.concat(`${joinType} join user_favorite as uf on uf.userId = ${filters.userId} and uf.questionId = q.id `);
			if (filters.myQuestions) {
				where = where === '' ? 'where q.userId = ? ' : where.concat('and q.userId = ? ');
				sqlValues.push(filters.userId);
				countValues.push(filters.userId);
			}
		}

		if (filters.fieldId) {
			where = where === '' ? 'where q.fieldId = ? ' : where.concat('and q.fieldId = ? ');
			sqlValues.push(filters.fieldId);
			countValues.push(filters.fieldId);
		}

		let order = 'order by q.id desc ';
		let pagination = 'limit ?, ? ';
		sqlValues.push(filters.offset);
		sqlValues.push(filters.limit);

		let select = 'select ';
		let sql = select.concat(columns, 'from question q ', join, where, order, pagination);
		let countBase = 'select count(q.id) as total from question as q ';
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
			return await mysql.query({ sql: 'delete from question where id = ?', values: [id] });
		} catch (e) {
			throw new Exception(statusCodes.BAD_REQUEST, e);
		}
	}

	static async update(id, data) {
		try {
			return await mysql.query({ sql: 'update question set ? where id = ?', values: [data, id] });
		} catch (e) {
			throw new Exception(statusCodes.BAD_REQUEST, e);
		}
	}
}

export default Question;
