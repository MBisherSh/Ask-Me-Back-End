import UserService from '../services/user';
import { statusCodes, Uploader } from '../../../utils';
import AssetService from '../../question/services/asset';

const updateProfileImage = async (req, res) => {
	const userId = req.user.id;
	const profileImage = res.locals.assets.profileImage[0];
	const image = await new AssetService(profileImage).create();
	const result = await UserService.updateProfileImage(userId, image.data.id, profileImage.url);
	res.status(statusCodes.UPDATED).json(result);
};

const updateProfileImageUploader = Uploader({
	fields: [{ name: 'profileImage', maxCount: 1, required: true }],
	maxFileSize: 15,
	allowedFileTypes: ['jpeg', 'jpg', 'png', 'gif'],
	isPrivate: false,
});

const getProfile = async (req, res) => {
	const userId = req.user.id;
	const result = await UserService.getProfile(userId);
	res.status(statusCodes.OK).json(result);
};

const addToFavoriteQuestions = async (req, res) => {
	const questionId = req.query.questionId;
	const user = req.user;
	const result = await UserService.addToFavoriteQuestions(user.id, questionId);
	res.status(statusCodes.CREATED).json(result);
};

const removeFromFavoriteQuestions = async (req, res) => {
	const questionId = req.query.questionId;
	const user = req.user;
	const result = await UserService.removeFromFavoriteQuestions(user.id, questionId);
	res.status(statusCodes.OK).json(result);
};

const getUserList = async (req, res) => {
	const pagination = req.query;
	const result = await UserService.getUserList(pagination);
	res.status(statusCodes.OK).json(result);
};

export default {
	updateProfileImage,
	updateProfileImageUploader,
	getProfile,
	addToFavoriteQuestions,
	removeFromFavoriteQuestions,
	getUserList,
};
