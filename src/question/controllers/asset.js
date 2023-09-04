import AssetService from '../services/asset';
import { statusCodes } from '../../../utils';

const getAssetById = async (req, res) => {
	const id = req.params.id;
	const result = await AssetService.getById(id);
	res.status(statusCodes.OK).json(result);
};

export default {
	getAssetById
};
