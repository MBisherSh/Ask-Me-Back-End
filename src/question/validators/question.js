import { commonChains, validator } from '../../../utils';

const getQuestion = validator.generator({
	schema: {
		limit: commonChains.numberRequired,
		offset: commonChains.numberRequired,
		subject: commonChains.stringOptional,
		userId: commonChains.numberOptional,
		fieldId: commonChains.numberOptional,
		isFavorite: commonChains.booleanOptional,
		myQuestions: commonChains.booleanOptional,
	},
	type: 'query',
});

const getQuestionById = validator.generator(
	{
		schema: {
			userId: commonChains.numberOptional,
		},
		type: 'query',
	},
	{
		schema: {
			id: commonChains.numberRequired,
		},
		type: 'params',
	}
);

const createQuestion = validator.generator({
	schema: {
		subject: commonChains.stringRequired,
		question: commonChains.stringRequired,
		fieldId: commonChains.numberRequired,
	},
	type: 'body',
});

const updateQuestion = validator.generator(
	{
		schema: {
			subject: commonChains.stringOptional,
			question: commonChains.stringOptional,
			fieldId: commonChains.numberOptional,
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

const deleteRateUnRateItem = validator.generator({
	schema: {
		id: commonChains.numberRequired,
	},
	type: 'params',
});

const answer = validator.generator(
	{
		schema: {
			answer: commonChains.stringRequired,
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

const getAnswers = validator.generator({
	schema: {
		limit: commonChains.numberRequired,
		offset: commonChains.numberRequired,
		userId: commonChains.numberOptional,
		questionId: commonChains.numberOptional,
		myAnswers: commonChains.booleanOptional,
	},
	type: 'query',
});

const setAnswerAsASolution = validator.generator({
	schema: {
		answerId: commonChains.numberRequired,
		isSolution: commonChains.booleanRequired,
	},
	type: 'body',
});

export default {
	getQuestion,
	getQuestionById,
	getAnswers,
	createQuestion,
	answer,
	setAnswerAsASolution,
	deleteRateUnRateItem,
	updateQuestion,
};
