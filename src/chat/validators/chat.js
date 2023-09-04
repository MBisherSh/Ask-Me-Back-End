import { commonChains, validator } from '../../../utils';

const getConsultancyList = validator.generator({
	schema: {
		limit: commonChains.numberRequired,
		offset: commonChains.numberRequired,
	},
	type: 'query',
});

const getConsultancyByTwoUserIds = validator.generator({
	schema: {
		id: commonChains.numberRequired,
	},
	type: 'params',
});

const getMessageList = validator.generator({
	schema: {
		limit: commonChains.numberRequired,
		offset: commonChains.numberRequired,
		consultancyId: commonChains.numberRequired,
		content: commonChains.stringOptional,
	},
	type: 'query',
});

export default { getMessageList, getConsultancyList,getConsultancyByTwoUserIds };
