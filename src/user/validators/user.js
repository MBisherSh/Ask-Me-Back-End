import { commonChains, validator } from '../../../utils';
import Joi from 'joi';

const addRemoveFavoriteQuestions = validator.generator({
	schema: {
		questionId: commonChains.numberRequired,
	},
	type: 'query',
});

const getUserList = validator.generator({
	schema: {
		limit: commonChains.numberRequired,
		offset: commonChains.numberRequired,
		role: Joi.number().integer().max(3).min(1).required(),
	},
	type: 'query',
});

export default { addRemoveFavoriteQuestions, getUserList };
