import User from '../models/user';
import UserFavorite from '../models/userFavorite';
import { Exception, statusCodes } from '../../../utils';
import AssetService from '../../question/services/asset';
import Specialist from './specialist';

class UserService {
	constructor(data) {
		this.name = data.name;
		this.email = data.email;
		this.phone = data.phone;
		this.role = data.role;
		this.passwordHash = data.passwordHash;
	}
	async createUser() {
		let isDuplicated = await User.getByEmailOrPhone(this.email, this.phone);
		if (isDuplicated)
			throw new Exception(
				statusCodes.DUPLICATED_ENTRY,
				'A user with this email or this phone is already registered'
			);
		return await this.save();
	}

	async save() {
		return await User.create(this);
	}

	static async getByEmailOrPhone(email, phone) {
		return await User.getByEmailOrPhone(email, phone);
	}

	static async findUserById(id) {
		return await User.getById(id);
	}
	static async updateUser(id, updatedFields) {
		return await User.update(id, updatedFields);
	}

	static async updateProfileImage(userId, profileImageId, url) {
		const user = await User.getById(userId);
		if (!profileImageId) throw new Exception(statusCodes.BAD_REQUEST, 'Please upload an image.');
		User.update(userId, { profileImageId }).then(async () => {
			await AssetService.delete(user.profileImageId);
		});
		return { msg: 'Profile image has been updated.', url };
	}

	static async getProfile(id) {
		const specialist = await Specialist.getById(id);
		if (specialist) {
			specialist.isSpecialist = true;
			return specialist;
		} else {
			const userData = await User.getById(id);
			return {
				id: userData.id,
				name: userData.name,
				role: userData.role,
				email: userData.email,
				phone: userData.phone,
				profileImageUrl: userData.profileImageUrl,
				isSpecialist: false,
			};
		}
	}

	static async addToFavoriteQuestions(userId, questionId) {
		try {
			await UserFavorite.create({ userId, questionId });
		} catch (e) {}
		return { msg: 'Question added to favorites.', data: { questionId } };
	}

	static async removeFromFavoriteQuestions(userId, questionId) {
		await UserFavorite.delete(userId, questionId);
		return { msg: 'Question removed from favorites.', data: { questionId } };
	}

	static async getUserList(filters) {
		const limit = parseInt(filters.limit);
		const offset = parseInt(filters.offset);
		const role = parseInt(filters.role);
		return await User.getList({ role, limit, offset });
	}
}

export default UserService;
