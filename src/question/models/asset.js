import { mysql, Exception, statusCodes } from '../../../utils/';

class Asset {
	static async create(data) {
		let insertedAsset = [[data.isPrivate, data.key]];

		try {
			return await mysql.query({
				sql: 'insert into asset ( isPrivate, `key` ) values ?',
				values: [insertedAsset],
			});
		} catch (e) {
			throw new Exception(statusCodes.BAD_REQUEST, e);
		}
	}

	static async getById(id) {
		let sql = 'select * from asset where id = ? limit 1';
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
			return await mysql.query({ sql: 'delete from asset where id = ?', values: [id] });
		} catch (e) {
			throw new Exception(statusCodes.BAD_REQUEST, e);
		}
	}

	static async update(id, data) {
		try {
			return await mysql.query({ sql: 'update asset set ? where id = ?', values: [data, id] });
		} catch (e) {
			throw new Exception(statusCodes.BAD_REQUEST, e);
		}
	}
}

export default Asset;
