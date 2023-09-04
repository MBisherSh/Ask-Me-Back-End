import SpecializationService from '../services/specialization';
import { statusCodes } from '../../../utils';

const getSpecialization = async (req, res) => {
	const filters = req.query;
	const result = await SpecializationService.get(filters);
	res.status(statusCodes.OK).json(result);
};

const deleteSpecialization = async (req, res) => {
	const id = req.params.id;
	const result = await SpecializationService.delete(id);
	res.status(statusCodes.DELETED).json(result);
};

const createSpecialization = async (req, res) => {
	const data = req.body;
	const result = await new SpecializationService(data).create();
	res.status(statusCodes.CREATED).json(result);
};

const updateSpecialization = async (req, res) => {
	const id = req.params.id;
	const data = req.body;
	const result = await SpecializationService.update(id, data);
	res.status(statusCodes.UPDATED).json(result);
};

export default {
	getSpecialization,
	createSpecialization,
	updateSpecialization,
	deleteSpecialization,
};
