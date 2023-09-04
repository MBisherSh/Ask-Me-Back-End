import SpecialistService from '../services/specialist';
import { statusCodes } from '../../../utils';

const getSpecialistList = async (req, res) => {
	const filters = req.query;
	const result = await SpecialistService.get(filters);
	res.status(statusCodes.OK).json(result);
};

const getSpecialistById = async (req, res) => {
	const id = req.params.id;
	const result = await SpecialistService.getById(id);
	res.status(statusCodes.OK).json(result);
};

const deleteSpecialist = async (req, res) => {
	const id = req.user.id;
	const result = await SpecialistService.delete(id);
	res.status(statusCodes.DELETED).json(result);
};

const createSpecialist = async (req, res) => {
	const data = req.body;
	data.userId = req.user.id;
	const result = await new SpecialistService(data).create();
	res.status(statusCodes.CREATED).json(result);
};

const updateSpecialist = async (req, res) => {
	const id = req.user.id;
	const data = req.body;
	const result = await SpecialistService.update(id, data);
	res.status(statusCodes.UPDATED).json(result);
};

const rate = async (req, res) => {
	const data = req.body;
	data.userId = req.user.id;
	const result = await SpecialistService.rate(data);
	res.status(statusCodes.UPDATED).json(result);
};

export default {
	getSpecialistList,
	getSpecialistById,
	createSpecialist,
	updateSpecialist,
	deleteSpecialist,
	rate,
};
