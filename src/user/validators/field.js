import { commonChains, validator } from '../../../utils';

const getField = validator.generator({
	schema: {
		limit: commonChains.numberRequired,
		offset: commonChains.numberRequired,
		name: commonChains.stringOptional,
	},
	type: 'query',
});

const createField = validator.generator({
	schema: {
		nameAr: commonChains.stringRequired,
		nameEn: commonChains.stringRequired,
	},
	type: 'body',
});

const updateField = validator.generator(
	{
		schema: {
			nameAr: commonChains.stringOptional,
			nameEn: commonChains.stringOptional,
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

const deleteField = validator.generator({
	schema: {
		id: commonChains.numberRequired,
	},
	type: 'params',
});

export default { getField, createField, updateField, deleteField };
