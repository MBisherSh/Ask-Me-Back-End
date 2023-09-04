import { commonChains, validator } from '../../../utils';

const getAssetById = validator.generator({
	schema: {
		id: commonChains.numberRequired,
	},
	type: 'params',
});

export default { getAssetById };
