import { mysql, Exception, statusCodes } from '../../../utils/';

class Field {
	static async create(data) {
		let insertedField = [[data.nameAr, data.nameEn]];

		try {
			return await mysql.query({
				sql: 'insert into field ( nameAr, nameEn ) values ?',
				values: [insertedField],
			});
		} catch (e) {
			throw new Exception(statusCodes.BAD_REQUEST, e);
		}
	}

	static async get(filters) {
		const sqlValues = [];
		const countValues = [];

		let base = 'select field.* from field ';
		let countBase = 'select count(id) as total from field ';
		let where = '';

		if (filters.name) {
			where = 'where ( nameAr like ? or nameEn like ? ) ';
			sqlValues.push(`%${filters.name}%`);
			sqlValues.push(`%${filters.name}%`);
			countValues.push(`%${filters.name}%`);
			countValues.push(`%${filters.name}%`);
		}

		let order = 'order by id asc ';
		let pagination = 'limit ?, ? ';
		sqlValues.push(filters.offset);
		sqlValues.push(filters.limit);
		let sql = base.concat(where, order, pagination);

		try {
			let result = {};
			if (filters.offset === 0) {
				const countSql = countBase.concat(where, order);
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
			return await mysql.query({ sql: 'delete from field where id = ?', values: [id] });
		} catch (e) {
			throw new Exception(statusCodes.BAD_REQUEST, e);
		}
	}

	static async update(id, data) {
		try {
			return await mysql.query({ sql: 'update field set ? where id = ?', values: [data, id] });
		} catch (e) {
			throw new Exception(statusCodes.BAD_REQUEST, e);
		}
	}
}

export default Field;
