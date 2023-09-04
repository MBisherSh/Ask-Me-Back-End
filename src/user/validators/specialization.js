import { commonChains, validator } from '../../../utils';

const getSpecialization = validator.generator({
	schema: {
		limit: commonChains.numberRequired,
		offset: commonChains.numberRequired,
		name: commonChains.stringOptional,
		fieldId: commonChains.numberOptional
	},
	type: 'query',
});

const createSpecialization = validator.generator({
	schema: {
		nameAr: commonChains.stringRequired,
		nameEn: commonChains.stringRequired,
		fieldId: commonChains.numberRequired
	},
	type: 'body',
});

const updateSpecialization = validator.generator(
	{
		schema: {
			nameAr: commonChains.stringOptional,
			nameEn: commonChains.stringOptional,
			fieldId: commonChains.numberOptional
		},
		type: 'body',
	},
	{
		schema: {
			id: commonChains.numberRequired,
		},
		type: 'params',
	}
);

const deleteSpecialization = validator.generator({
	schema: {
		id: commonChains.numberRequired,
	},
	type: 'params',
});

export default { getSpecialization, createSpecialization, updateSpecialization, deleteSpecialization };
