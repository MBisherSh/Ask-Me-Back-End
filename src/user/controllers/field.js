import FieldService from '../services/field';
import { statusCodes } from '../../../utils';

const getField = async (req, res) => {
	const filters = req.query;
	const result = await FieldService.get(filters);
	res.status(statusCodes.OK).json(result);
};

const deleteField = async (req, res) => {
	const id = req.params.id;
	const result = await FieldService.delete(id);
	res.status(statusCodes.DELETED).json(result);
};

const createField = async (req, res) => {
	const data = req.body;
	const result = await new FieldService(data).create();
	res.status(statusCodes.CREATED).json(result);
};

const updateField = async (req, res) => {
	const id = req.params.id;
	const data = req.body;
	const result = await FieldService.update(id, data);
	res.status(statusCodes.UPDATED).json(result);
};

export default {
	getField,
	createField,
	updateField,
	deleteField,
};
