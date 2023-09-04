import { mysql, Exception, statusCodes } from '../../../utils/';

class Message {
	static async create(data) {
		let insertedMessage = [[data.senderId, data.consultancyId, data.content, data.seenAt]];

		try {
			return await mysql.query({
				sql: 'insert into message ( senderId , consultancyId, content, seenAt ) values ?',
				values: [insertedMessage],
			});
		} catch (e) {
			throw new Exception(statusCodes.BAD_REQUEST, e);
		}
	}

	static async get(filters) {
		const sqlValues = [];
		const countValues = [];

		let base = 'select m.* from message as m ';
		let countBase = 'select count(m.id) as total from message as m ';
		let where = '';

		if (filters.content) {
			where = 'where  m.content like ? ';
			sqlValues.push(`%${filters.content}%`);
			countValues.push(`%${filters.content}%`);
		}

		if (filters.consultancyId) {
			where = where === '' ? 'where m.consultancyId = ? ' : where.concat(' and m.consultancyId = ? ');
			sqlValues.push(filters.consultancyId);
			countValues.push(filters.consultancyId);
		}

		if (filters.unseen) where = where === '' ? 'where m.seenAt is null ' : where.concat(' and m.seenAt is null ');

		let order = 'order by m.createdAt desc ';
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

	static async getUnseen(userId) {
		const sqlValues = [];

		let base = 'select m.*, user.name, user.email, user.phone,' +
			' concat(\'https://ask-me-assets-public.s3.us-east-2.amazonaws.com/\',asset.key) as senderUserProfileImageUrl' +
			' from consultancy as c ';
		let join =
			'inner join message as m ' +
			'on m.consultancyId = c.id ' +
			'and (c.firstUserId = ? or c.secondUserId = ?) ' +
			'and m.seenAt is null ' +
			'and m.senderId != ? ' +
			'inner join user ' +
			'on user.id = m.senderId ' +
			'inner join asset on asset.id = user.profileImageId ';
		sqlValues.push(userId);
		sqlValues.push(userId);
		sqlValues.push(userId);

		let order = 'order by c.id desc , m.id desc ';

		let sql = base.concat(join, order);

		try {
			let result = {};
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
			return await mysql.query({ sql: 'delete from message where id = ?', values: [id] });
		} catch (e) {
			throw new Exception(statusCodes.BAD_REQUEST, e);
		}
	}

	static async update(id, data) {
		try {
			return await mysql.query({ sql: 'update message set ? where id = ?', values: [data, id] });
		} catch (e) {
			throw new Exception(statusCodes.BAD_REQUEST, e);
		}
	}
	static async seeMessage(ids) {
		try {
			return await mysql.query({
				sql: 'update message set seenAt = current_timestamp() where id in ( ? ) ',
				values: [ids],
			});
		} catch (e) {
			throw new Exception(statusCodes.BAD_REQUEST, e);
		}
	}

}

export default Message;
