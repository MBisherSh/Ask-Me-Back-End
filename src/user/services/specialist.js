import User from '../models/user';
import Specialist from '../models/specialist';
import SpecialistRating from '../models/specialistRating';
import { statusCodes, Exception } from '../../../utils';

class SpecialistService {
	constructor(data) {
		this.userId = data.userId;
		this.lat = data.lat;
		this.lng = data.lng;
		this.specializationId = data.specializationId;
	}
	async create() {
		const user = await User.getById(this.userId);
		if (!user) throw new Exception(statusCodes.BAD_REQUEST, 'no such user');
		let result;
		try {
			result = await this.save();
		} catch (e) {
			throw new Exception(statusCodes.BAD_REQUEST, 'user has already registered as a specialist');
		}
		return { msg: `A specialist has been created.`, data: { id: result.insertId, specialist: this } };
	}

	async save() {
		return await Specialist.create(this);
	}

	static async get(filters) {
		return await Specialist.getList({
			limit: parseInt(filters.limit),
			offset: parseInt(filters.offset),
			specializationId: filters.specializationId,
			fieldId: filters.fieldId,
			startLat: filters.startLat ? parseFloat(filters.startLat) : filters.startLat,
			startLng: filters.startLng ? parseFloat(filters.startLng) : filters.startLng,
			online: filters.online === 'true' || filters.online === true ? true : undefined,
		});
	}

	static async getById(id) {
		return await Specialist.getById(id);
	}

	static async update(id, data) {
		await Specialist.update(id, data);
		return { msg: `specialist has been updated.`, data: { id, updatedData: data } };
	}

	static async delete(id) {
		let deletedId;
		if (typeof id === 'string') deletedId = parseInt(id);
		else deletedId = id;
		return await Specialist.delete(deletedId);
	}

	static async rate(data) {
		await SpecialistRating.rate(data);
		return { msg: `specialist has been rated.`, data };
	}
}

export default SpecialistService;
