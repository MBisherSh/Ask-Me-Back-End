import Specialization from '../models/specialization';

class SpecializationService {
	constructor(data) {
		this.nameAr = data.nameAr;
		this.nameEn = data.nameEn;
		this.fieldId = data.fieldId;
	}
	async create() {
		const result = await this.save();
		return { msg: `A specialization has been created.`, data: { id: result.insertId, specialization: this } };
	}

	async save() {
		return await Specialization.create(this);
	}

	static async get(filters) {
		return await Specialization.get({
			limit: parseInt(filters.limit),
			offset: parseInt(filters.offset),
			name: filters.name,
			fieldId: filters.fieldId ? parseInt(filters.fieldId) : filters.fieldId,
		});
	}

	static async update(id, data) {
		await Specialization.update(id, data);
		return { msg: `specialization has been updated.`, data: { id, updatedData: data } };
	}

	static async delete(id) {
		let deletedId;
		if (typeof id === 'string') deletedId = parseInt(id);
		else deletedId = id;
		return await Specialization.delete(deletedId);
	}
}

export default SpecializationService;
