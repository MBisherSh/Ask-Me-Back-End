import { mysql, Exception, statusCodes } from '../../../utils/';

class Consultancy {
	static async create(data) {
		let insertedConsultancy = [[data.firstUserId, data.secondUserId]];

		try {
			return await mysql.query({
				sql: 'insert into consultancy ( firstUserId, secondUserId ) values ?',
				values: [insertedConsultancy],
			});
		} catch (e) {
			throw new Exception(statusCodes.BAD_REQUEST, e);
		}
	}

	static async get(filters) {
		const { limit, offset, userId } = filters;
		let sqlValues = [];
		let countValues = [];
		let columns =
			'consultancy.*, ' +
			'fu.name as firstUserName, fu.phone as firstUserPhone, fu.email as firstUserEmail, ' +
			'su.name as secondUserName, su.phone as secondUserPhone, su.email as secondUserEmail, ' +
			"concat('https://ask-me-assets-public.s3.us-east-2.amazonaws.com/',fasset.key) as firstUserProfileImageUrl, " +
			"concat('https://ask-me-assets-public.s3.us-east-2.amazonaws.com/',sasset.key) as secondUserProfileImageUrl ";
		let join =
			'inner  join user as fu on fu.id = consultancy.firstUserId ' +
			'inner  join user as su on su.id = consultancy.secondUserId ' +
			'left join asset as fasset on fasset.id = fu.profileImageId ' +
			'left join asset as sasset on sasset.id = su.profileImageId ';

		let sort = 'order by consultancy.createdAt desc, consultancy.id desc ';

		let where = '';
		if (userId) {
			where = 'where consultancy.firstUserId = ? or consultancy.secondUserId = ? ';
			sqlValues.push(userId);
			sqlValues.push(userId);
			countValues.push(userId);
			countValues.push(userId);
		}

		let base = `select ${columns} from consultancy `;
		let countBase = 'select count(consultancy.id) as total from consultancy ';
		let pagination = 'limit ? , ? ';
		sqlValues.push(offset);
		sqlValues.push(limit);

		const countSql = countBase.concat(join, where);
		let sql = base.concat(join, where, sort, pagination);

		try {
			let result = {};
			if (offset === 0) {
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

	static async getByTwoUserIds(firstUserId, secondUserId) {
		let sql =
			'select * from consultancy where (firstUserId = ? && secondUserId = ?) or (firstUserId = ? && secondUserId = ?) ';

		try {
			let result = await mysql.query({
				sql,
				values: [firstUserId, secondUserId, secondUserId, firstUserId],
			});
			if (result.length > 0) return result[0];
			else return null;
		} catch (e) {
			throw new Exception(statusCodes.BAD_REQUEST, e);
		}
	}

	static async getById(id) {
		let sql = 'select * from consultancy where id = ? ';

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

	static async delete(id) {
		try {
			return await mysql.query({ sql: 'delete from consultancy where id = ?', values: [id] });
		} catch (e) {
			throw new Exception(statusCodes.BAD_REQUEST, e);
		}
	}

	static async update(id, data) {
		try {
			return await mysql.query({ sql: 'update consultancy set ? where id = ?', values: [data, id] });
		} catch (e) {
			throw new Exception(statusCodes.BAD_REQUEST, e);
		}
	}
}

export default Consultancy;
