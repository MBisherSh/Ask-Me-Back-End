import { commonChains, validator } from '../../../utils';
import Joi from 'joi';

const getSpecialistList = validator.generator({
	schema: {
		limit: commonChains.numberRequired,
		offset: commonChains.numberRequired,
		fieldId: commonChains.numberOptional,
		startLat: commonChains.numberOptional,
		startLng: commonChains.numberOptional,
		specializationId: commonChains.numberOptional,
		online: commonChains.booleanOptional,
	},
	type: 'query',
});

const createSpecialist = validator.generator({
	schema: {
		lat: commonChains.numberRequired,
		lng: commonChains.numberRequired,
		specializationId: commonChains.numberRequired,
	},
	type: 'body',
});

const updateSpecialist = validator.generator(
	{
		schema: {
			lat: commonChains.numberOptional,
			lng: commonChains.numberOptional,
			specializationId: commonChains.numberOptional,
		},
		type: 'body',
	}
);

const rate = validator.generator({
	schema: {
		specialistId: commonChains.numberRequired,
		stars: Joi.number().integer().required().max(5).min(1)
	},
	type: 'body',
});

export default { getSpecialistList, createSpecialist, updateSpecialist, rate };
