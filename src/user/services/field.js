import Field from '../models/field';

class FieldService {
	constructor(data) {
		this.nameAr = data.nameAr;
		this.nameEn = data.nameEn;
	}
	async create() {
		const result = await this.save();
		return { msg: `A field has been created.`, data: { id: result.insertId, field: this } };
	}

	async save() {
		return await Field.create(this);
	}

	static async get(filters) {
		const limit = parseInt(filters.limit);
		const offset = parseInt(filters.offset);
		return await Field.get({ limit, offset, name: filters.name });
	}

	static async update(id, data) {
		await Field.update(id, data);
		return { msg: `field has been updated.`, data: { id, updatedData: data } };
	}

	static async delete(id) {
		let deletedId;
		if (typeof id === 'string') deletedId = parseInt(id);
		else deletedId = id;
		return await Field.delete(deletedId);
	}
}

export default FieldService;
