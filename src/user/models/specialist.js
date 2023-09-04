import { mysql, Exception, statusCodes } from '../../../utils/';

class Specialist {
	static async create(data) {
		let insertedSpecialist = [[data.userId, data.lat, data.lng, data.specializationId]];
		try {
			return await mysql.query({
				sql: 'insert into specialist ( userId, lat, lng, specializationId ) values ?',
				values: [insertedSpecialist],
			});
		} catch (e) {
			throw new Exception(statusCodes.BAD_REQUEST, e);
		}
	}

	static async getById(id) {
		let columns =
			'user.id, user.name, user.phone, user.email, user.role, ' +
			"concat('https://ask-me-assets-public.s3.us-east-2.amazonaws.com/',asset.key) as profileImageUrl, " +
			'specialist.lat, specialist.lng, s.nameAr as specializationNameAr, s.nameEn as specializationNameEn, ' +
			'f.nameAr as fieldNameAr, f.nameEn as fieldNameEn, sum(sr.stars)/count(sr.userId) as rating ';
		let join =
			'inner join specialist on specialist.userId = user.id ' +
			'inner join specialization as s on s.id = specialist.specializationId ' +
			'inner join field as f on f.id = s.fieldId ' +
			'left outer join asset on asset.id = user.profileImageId ' +
			'left join specialist_rating as sr on user.id = sr.specialistId ';
		let sql = `select ${columns} from user ${join} where user.id = ? group by user.id limit 1`;
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
		let deletedId;
		if (typeof id === 'string') deletedId = parseInt(id);
		else deletedId = id;

		try {
			return await mysql.query({ sql: 'delete from specialist where userId = ?', values: [deletedId] });
		} catch (e) {
			throw new Exception(statusCodes.BAD_REQUEST, e);
		}
	}

	static async update(id, data) {
		try {
			return await mysql.query({ sql: 'update specialist set ? where userId = ?', values: [data, id] });
		} catch (e) {
			throw new Exception(statusCodes.BAD_REQUEST, e);
		}
	}

	static async getList(filters) {
		const { limit, offset, specializationId, fieldId, startLat, startLng, online } = filters;
		let sqlValues = [];
		let countValues = [];
		let columns =
			'user.id, user.name, user.phone, user.email, ' +
			"concat('https://ask-me-assets-public.s3.us-east-2.amazonaws.com/',asset.key) as profileImageUrl, " +
			'specialist.lat, specialist.lng, s.nameAr as specializationNameAr, s.nameEn as specializationNameEn, ' +
			'f.nameAr as fieldNameAr, f.nameEn as fieldNameEn, sum(sr.stars)/count(sr.userId) as rating ' +
			',count(cu.connectionId) as onlineCount ';
		let joinType = online ? 'inner' : 'left';
		let join =
			'left  join asset on asset.id = user.profileImageId ' +
			'inner join specialist on specialist.userId = user.id ' +
			'left join specialization as s on s.id = specialist.specializationId ' +
			`${joinType} join connected_user as cu on cu.userId = user.id ` +
			'left join field as f on f.id = s.fieldId ';
		let sqlJoin = join.concat('left join specialist_rating as sr on user.id = sr.specialistId ');
		let groupBy = 'group by user.id ';
		let sort = 'order by rating desc, user.id ';
		if (startLat && startLng) {
			columns = columns.concat(
				',sqrt(pow(69.1 * (specialist.lat - ? ), 2) + pow(69.1 * ( ? - specialist.lng) * cos(specialist.lat / 57.3), 2)) as distance '
			);
			sqlValues.push(startLat);
			sqlValues.push(startLng);
			sort = 'order by distance asc, rating desc, user.id ';
		}

		let where = '';
		if (specializationId) {
			where = 'where specialist.specializationId = ? ';
			sqlValues.push(specializationId);
			countValues.push(specializationId);
		}

		if (fieldId) {
			where = where === '' ? 'where s.fieldId = ? ' : where.concat('and s.fieldId = ? ');
			sqlValues.push(fieldId);
			countValues.push(fieldId);
		}

		let base = `select ${columns} from user `;
		let countBase = 'select count(user.id) as total from user ';
		let pagination = 'limit ? , ? ';
		sqlValues.push(offset);
		sqlValues.push(limit);

		const countSql = countBase.concat(join, where);
		let sql = base.concat(sqlJoin, where, groupBy, sort, pagination);

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
}

export default Specialist;
