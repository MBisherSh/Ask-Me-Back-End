import { mysql, Exception, statusCodes } from '../../../utils/';

class User {
	static async create(data) {
		let insertedUser = [[data.name, data.email, data.phone, data.passwordHash, data.role]];
		try {
			return await mysql.query({
				sql: 'insert into user ( name, email, phone, passwordHash, role ) values ?',
				values: [insertedUser],
			});
		} catch (e) {
			throw new Exception(statusCodes.BAD_REQUEST, e);
		}
	}

	static async getById(id) {
		let sql =
			"select user.*, concat('https://ask-me-assets-public.s3.us-east-2.amazonaws.com/',asset.key) as profileImageUrl from user left outer join asset on asset.id = user.profileImageId where user.id = ? limit 1";

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

	static async getByEmailOrPhone(email, phone) {
		let sql =
			"select user.*, concat('https://ask-me-assets-public.s3.us-east-2.amazonaws.com/',asset.key) as profileImageUrl from user left outer join asset on asset.id = user.profileImageId where email = ? or phone = ? limit 1";

		try {
			let result = await mysql.query({
				sql,
				values: [email, phone],
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
			return await mysql.query({ sql: 'delete from user where id = ?', values: [deletedId] });
		} catch (e) {
			throw new Exception(statusCodes.BAD_REQUEST, e);
		}
	}

	static async update(id, data) {
		try {
			return await mysql.query({ sql: 'update user set ? where id = ?', values: [data, id] });
		} catch (e) {
			throw new Exception(statusCodes.BAD_REQUEST, e);
		}
	}

	static async getList(filters) {
		const { limit, offset, role } = filters;

		let base =
			"select user.id, user.name, user.phone, user.email, concat('https://ask-me-assets-public.s3.us-east-2.amazonaws.com/',asset.key) as profileImageUrl from user left outer join asset on asset.id = user.profileImageId where role = ? ";
		let countBase = 'select count(id) as total from user where role = ? ';
		let pagination = 'limit ? , ? ';

		let sql = base.concat(pagination);

		try {
			let result = {};
			if (offset === 0) {
				const countSql = countBase.concat();
				result.total = (
					await mysql.query({
						sql: countSql,
						values: [role],
					})
				)[0].total;
			}
			result.data = await mysql.query({
				sql,
				values: [role, offset, limit],
			});
			return result;
		} catch (e) {
			throw new Exception(statusCodes.BAD_REQUEST, e);
		}
	}
}

export default User;
