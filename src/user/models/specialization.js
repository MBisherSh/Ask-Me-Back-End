import { mysql, Exception, statusCodes } from '../../../utils/';

class Specialization {
	static async create(data) {
		let insertedSpecialization = [[data.nameAr, data.nameEn, data.fieldId]];

		try {
			return await mysql.query({
				sql: 'insert into specialization ( nameAr, nameEn, fieldId ) values ?',
				values: [insertedSpecialization],
			});
		} catch (e) {
			throw new Exception(statusCodes.BAD_REQUEST, e);
		}
	}

	static async get(filters) {
		const sqlValues = [];
		const countValues = [];

		let base =
			'select s.*,f.nameAr as fieldNameAr, f.nameEn as fieldNameEn from specialization as s left join field as f on f.id = s.fieldId ';
		let countBase =
			'select count(s.id) as total from specialization as s left join field as f on f.id = s.fieldId ';
		let where = '';

		if (filters.name) {
			where = 'where  s.nameAr like ? or s.nameEn like ? or f.nameAr like ? or f.nameEn like ? ';
			sqlValues.push(`%${filters.name}%`);
			sqlValues.push(`%${filters.name}%`);
			sqlValues.push(`%${filters.name}%`);
			sqlValues.push(`%${filters.name}%`);
			countValues.push(`%${filters.name}%`);
			countValues.push(`%${filters.name}%`);
			countValues.push(`%${filters.name}%`);
			countValues.push(`%${filters.name}%`);
		}

		if (filters.fieldId) {
			where = where === '' ? 'where s.fieldId = ? ' : where.concat('and s.fieldId = ? ');
			sqlValues.push(filters.fieldId);
			countValues.push(filters.fieldId);
		}

		let order = 'order by s.id asc ';
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
			return await mysql.query({ sql: 'delete from specialization where id = ?', values: [id] });
		} catch (e) {
			throw new Exception(statusCodes.BAD_REQUEST, e);
		}
	}

	static async update(id, data) {
		try {
			return await mysql.query({ sql: 'update specialization set ? where id = ?', values: [data, id] });
		} catch (e) {
			throw new Exception(statusCodes.BAD_REQUEST, e);
		}
	}
}

export default Specialization;
