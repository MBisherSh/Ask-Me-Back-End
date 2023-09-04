import { mysql, Exception, statusCodes } from '../../../utils/';

class ConnectedUser {
	static async create(data) {
		let insertedConnectedUser = [[data.userId, data.connectionId]];

		try {
			return await mysql.query({
				sql: 'insert into connected_user ( userId, connectionId ) values ?',
				values: [insertedConnectedUser],
			});
		} catch (e) {
			throw new Exception(statusCodes.BAD_REQUEST, e);
		}
	}

	static async get(filters) {
		const sqlValues = [];
		const countValues = [];

		let base = 'select connected_user.* from connected_user ';
		let countBase = 'select count(id) as total from connected_user ';
		let where = '';

		if (filters.userId) {
			where = 'where userId = ? ';
			sqlValues.push(filters.userId);
			countValues.push(filters.userId);
		}

		let order = 'order by connectedAt desc ';
		let pagination = 'limit ?, ? ';
		sqlValues.push(filters.offset);
		sqlValues.push(filters.limit);
		let sql = base.concat(where, order, pagination);

		try {
			let result = {};
			if (filters.offset === 0) {
				const countSql = countBase.concat(where);
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

	static async getByConnectionId(connectionId) {
		let sql = 'select * from connected_user where connectionId = ? ';

		try {
			let result = await mysql.query({
				sql,
				values: [connectionId],
			});
			if (result.length > 0) return result[0];
			else return null;
		} catch (e) {
			throw new Exception(statusCodes.BAD_REQUEST, e);
		}
	}

	static async getByUserId(userId) {
		let sql = 'select * from connected_user where userId = ? ';

		try {
			return  await mysql.query({
				sql,
				values: [userId],
			});
		} catch (e) {
			throw new Exception(statusCodes.BAD_REQUEST, e);
		}
	}

	static async delete(connectionId) {
		try {
			return await mysql.query({
				sql: 'delete from connected_user where connectionId like ?',
				values: [connectionId],
			});
		} catch (e) {
			throw new Exception(statusCodes.BAD_REQUEST, e);
		}
	}
}

export default ConnectedUser;
